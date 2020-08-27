import { BaseSerializer } from "../serializers/base.serializer";
import { BaseRepository } from "../repositories/base.repository";
import { Type } from "../types/global";
import { JsonApiModel } from "../models/json-api.model";
import { Request , Response, } from "express";
import { ApplicationRegistry } from "../application/registry.application";
import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import PaginationQueryParams from "../types/jsonapi";
import { ObjectLiteral } from "typeorm";
import { Get, Patch, Delete, Post, DeserializeJsonApi, ValidateJsonApi } from "../decorators/controller.decorator";
import BaseController from "./base.controller";

export default abstract class BaseJsonApiController<T extends JsonApiModel<T>> extends BaseController {
    protected serializer: BaseSerializer<T>;
    protected repository: BaseRepository<T>;

    public constructor() {
        super();
        const entity: Type<T> = Reflect.getMetadata("entity",this);
        this.serializer = ApplicationRegistry.serializerFor(entity);
        this.repository = ApplicationRegistry.repositoryFor(entity);
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

    public async remove(req: Request, res: Response): Promise<any> {
        const user = await this.repository.findOne(req.params.id);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async fetchRelationships(req: Request) {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation).inverseEntityMetadata;

        return ApplicationRegistry.serializerFor(otherEntityMetadata.target as any).serialize(
            await this.repository.fetchRelationshipsFromRequest(
                relation,
                req.params.id,
                this.parseJsonApiQueryParams(req.query)
            )
        );
    }

    public async fetchRelated(req: Request): Promise<any> {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation)?.inverseEntityMetadata;

        if (!otherEntityMetadata) {
            throw Boom.notFound();
        }

        return ApplicationRegistry.serializerFor(otherEntityMetadata.target as any).serialize(
            await this.repository.fetchRelated(
                relation,
                req.params.id,
                this.parseJsonApiQueryParams(req.query)
            )
        );
    }

    public async addRelationships(req: Request, res: Response): Promise<any> {
        const {relation,id} = req.params;

        await this.repository.addRelationshipsFromRequest(relation,id,req.body.data);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async updateRelationships(req: Request, res: Response): Promise<any> {
        const {relation,id} = req.params;

        await this.repository.updateRelationshipsFromRequest(relation,id,req.body.data);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async removeRelationships(req: Request, res: Response): Promise<any> {
        const {relation,id} = req.params;

        await this.repository.removeRelationshipsFromRequest(relation,id,req.body.data);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    protected parseJsonApiQueryParams(query: ObjectLiteral) {
        return {
            includes : query.include ? (query.include as string).split(",") : null,
            sort : query.sort ? (query.sort as string).split(",") : null,
            fields : query.fields ?? null,
            page: query.page ?? null,
            filter: query.filter ?? null
        }
    }
}
