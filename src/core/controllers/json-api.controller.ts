import { BaseSerializer } from "../serializers/base.serializer";
import { BaseRepository } from "../repositories/base.repository";
import { Type } from "../types/global";
import { JsonApiModel } from "../models/json-api.model";
import { Request , Response, } from "express";
import { ApplicationRegistry } from "../application/registry.application";
import * as HttpStatus from "http-status";
import * as Boom from "@hapi/boom";
import { ObjectLiteral } from "typeorm";
import BaseController from "./base.controller";
import PaginationResponse from "../responses/pagination.response";
import ApiResponse from "../responses/response.response";
import { ApiResponse } from "@elastic/elasticsearch";


export default abstract class BaseJsonApiController<T extends JsonApiModel<T>> extends BaseController {
    protected serializer: BaseSerializer<T>;
    protected repository: BaseRepository<T>;

    public constructor() {
        super();
        const entity: Type<T> = Reflect.getMetadata("entity",this);
        this.serializer = ApplicationRegistry.serializerFor(entity);
        this.repository = ApplicationRegistry.repositoryFor(entity);
    }

    public callMethod(methodName: string): any {
        return async (req: Request, res: Response, next: (arg0: any) => any) => {
            try {
                const response = await this[methodName](req, res);
                if (!res.headersSent) {
                    const useSchema = Reflect.getMetadata("schema-use",this,methodName) ?? "default";

                    if (response instanceof PaginationResponse) {
                        const serialized = this.serializer.serialize(response.body,{
                            schema: useSchema,
                            paginationData: response.paginationData
                        });
                        res.status(response.status);
                        res.type(response.type);
                        res.send(serialized);
                    }else if (response instanceof ApiResponse) {
                        const serialized = this.serializer.serialize(response.body,{
                            schema: useSchema
                        });
                        res.status(response.status);
                        res.type(response.type);
                        res.send(serialized);
                    }else{
                        const serialized = this.serializer.serialize(response,{
                            schema: useSchema
                        });
                        res.status(200);
                        res.type("json");
                        res.send(serialized);
                    }
                }
            } catch (e) {
                return next(e);
            }
        }
    }

    public async list(req: Request,res: Response): Promise<any> {
        const params = this.parseJsonApiQueryParams(req.query);

        const [entities,count] = await this.repository.jsonApiRequest(params).getManyAndCount();

        return new PaginationResponse(entities,{
            total: count,
            url: req.url,
            page: params.page.number,
            size: params.page.size
        });
    }

    public async get(req: Request,res: Response): Promise<any> {
        const user = await this.repository.jsonApiFindOne(req, req.params.id);

        if (!user) {
            throw Boom.notFound("User not found");
        }

        return user;
    }

    public async create(req: Request, res: Response): Promise<any> {
        const user = this.repository.create(req.body as object);
        const saved = await this.repository.save(user as any);
        res.status(HttpStatus.CREATED);
        return new ApiResponse(saved,{status : 201,type: "json"});
    }

    public async update(req: Request,res: Response): Promise<any> {
        let saved = await this.repository.preload({
            ...req.body, ...{id : req.params.id}
        });

        if (saved === undefined) {
            throw Boom.notFound("User not found");
        }

        saved = await this.repository.save(saved as any);

        return saved;
    }

    public async remove(req: Request, res: Response): Promise<any> {
        const user = await this.repository.findOne(req.params.id);

        if (!user) {
            throw Boom.notFound();
        }

        await this.repository.remove(user);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async fetchRelationships(req: Request,res: Response) {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation).inverseEntityMetadata;

        return res.send(ApplicationRegistry.serializerFor(otherEntityMetadata.target as any).serialize(
            await this.repository.fetchRelationshipsFromRequest(
                relation,
                req.params.id,
                this.parseJsonApiQueryParams(req.query)
            )
        ));
    }

    public async fetchRelated(req: Request,res: Response): Promise<any> {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation)?.inverseEntityMetadata;

        if (!otherEntityMetadata) {
            throw Boom.notFound();
        }

        return res.send(ApplicationRegistry.serializerFor(otherEntityMetadata.target as any).serialize(
            await this.repository.fetchRelated(
                relation,
                req.params.id,
                this.parseJsonApiQueryParams(req.query)
            )
        ));
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
