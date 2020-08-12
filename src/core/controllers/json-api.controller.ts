import { BaseSerializer } from "../../api/serializers/base.serializer";
import { BaseRepository } from "../repositories/base.repository";
import { Type } from "../types/global";
import ControllerInterface from "../interfaces/controller.interface";
import { JsonApiModel } from "../models/json-api.model";
import { Request , Response } from "express";
import { ApplicationRegistry } from "../application/registry.application";
import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import PaginationQueryParams from "../types/jsonapi";

export default abstract class BaseJsonApiController<T extends JsonApiModel<T>> implements ControllerInterface {
    protected serializer: BaseSerializer<T>;
    protected repository: BaseRepository<T>;

    public constructor() {
        const entity: Type<T> = Reflect.getMetadata("entity",this);
        this.serializer = ApplicationRegistry.serializerFor(entity);
        this.repository = ApplicationRegistry.repositoryFor(entity);
    }

    public async fetchRelationships(req: Request) {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation).inverseEntityMetadata;

        return ApplicationRegistry.serializerFor(otherEntityMetadata.target as any).serialize(
            await this.repository.fetchRelationshipsFromRequest(
                relation,
                req.params.id,
                {
                    includes : req.query.include ? (req.query.include as string).split(",") : null,
                    sort : req.query.sort ? (req.query.sort as string).split(",") : null,
                    fields : req.query.fields as any ?? null,
                    page: req.query.page as any ?? null,
                    filter: null
                }
            )
        );
    }

    public async fetchRelated(req: Request): Promise<any> {
        return this.repository.fetchRelated(req, this.serializer);
    }

    public async addRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.addRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async updateRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.updateRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async removeRelationships(req: Request, res: Response): Promise<any> {
        await this.repository.removeRelationshipsFromRequest(req);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async get(req: Request): Promise<void> {
        const user = await this.repository.jsonApiFindOne(req, req.params.id);

        if (!user) {
            throw Boom.notFound("User not found");
        }

        return this.serializer.serialize(user);
    }

    public async create(req: Request, res: Response): Promise<any> {
        const user = this.repository.create(req.body as object);
        const saved = await this.repository.save(user as any);
        res.status(HttpStatus.CREATED);
        return this.serializer.serialize(saved);
    }

    public async update(req: Request): Promise<any> {
        let saved = await this.repository.preload({
            ...req.body, ...{id : req.params.id}
        });

        if (saved === undefined) {
            throw Boom.notFound("User not found");
        }

        saved = await this.repository.save(saved as any);

        return this.serializer.serialize(saved);
    }

    public async list(req: Request): Promise<any> {
        const [users, totalUsers] = await this.repository.jsonApiRequest({
            includes : req.query.include ? (req.query.include as string).split(",") : null,
            sort : req.query.sort ? (req.query.sort as string).split(",") : null,
            fields : req.query.fields as any ?? null,
            page: req.query.page as any ?? null
        }).getManyAndCount();

        if (req.query.page) {
            const page: PaginationQueryParams = req.query.page as any;

            return this.serializer.serialize(users,{
                paginationData: {
                    page: page.number,
                    size: page.size,
                    total: totalUsers,
                    url: req.url
                }
            });
        }

        return this.serializer
            .serialize(users);
    }

    public async remove(req: Request, res: Response): Promise<any> {
        const user = await this.repository.findOne(req.params.id);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
}
