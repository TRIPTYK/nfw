/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Boom from "@hapi/boom";
import { Request, Response } from "express";
import * as HttpStatus from "http-status";
import { DeepPartial } from "typeorm";
import { ApplicationRegistry } from "../application/registry.application";
import { JsonApiModel } from "../models/json-api.model";
import BaseJsonApiRepository from "../repositories/base.repository";
import PaginationResponse from "../responses/pagination.response";
import ApiResponse from "../responses/response.response";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";
import BaseController from "./base.controller";

export default abstract class BaseJsonApiController<
    T extends JsonApiModel<T>
> extends BaseController {
    public entity: Constructor<T>;
    protected serializer: BaseJsonApiSerializer<T>;
    protected repository: BaseJsonApiRepository<T>;

    public constructor() {
        super();
        this.entity = Reflect.getMetadata("entity", this);
        this.name = Reflect.getMetadata("name", this.entity);
        this.serializer = ApplicationRegistry.serializerFor(this.entity);
        this.repository = ApplicationRegistry.repositoryFor(this.entity);
    }

    public callMethod(methodName: string): any {
        return async (
            req: Request,
            res: Response,
            next: (arg0: any) => any
        ) => {
            try {
                const response = await this[methodName](req, res);

                if (!res.headersSent) {
                    const useSchema =
                        Reflect.getMetadata("schema-use", this, methodName) ??
                        "default";

                    if (response instanceof PaginationResponse) {
                        const serialized = await this.serializer.serialize(
                            response.body,
                            useSchema,
                            response.paginationData
                        );
                        res.status(response.status);
                        res.type(response.type);
                        res.send(serialized);
                    } else if (response instanceof ApiResponse) {
                        const serialized = await this.serializer.serialize(
                            response.body,
                            useSchema,
                            {
                                url: req.url
                            }
                        );
                        res.status(response.status);
                        res.type(response.type);
                        res.send(serialized);
                    } else {
                        const serialized = await this.serializer.serialize(
                            response,
                            useSchema,
                            {
                                url: req.url
                            }
                        );
                        res.status(200);
                        res.type("application/vnd.api+json");
                        res.send(serialized);
                    }
                }
            } catch (e) {
                return next(e);
            }
        };
    }

    public async list(req: Request, _res: Response): Promise<any> {
        const params = this.parseJsonApiQueryParams(req.query);

        const [entities, count] = await this.repository
            .jsonApiRequest(params)
            .getManyAndCount();

        return req.query.page
            ? new PaginationResponse(entities, {
                  total: count,
                  page: params.page.number,
                  size: params.page.size,
                  url: req.url
              })
            : entities;
    }

    public async get(req: Request, _res: Response): Promise<any> {
        const params = this.parseJsonApiQueryParams(req.query);
        const entity = await this.repository
            .jsonApiRequest(params)
            .andWhere(`${this.repository.metadata.tableName}.id = :id`, {
                id: req.params.id
            })
            .getOne();

        if (!entity) {
            throw Boom.notFound();
        }

        return entity;
    }

    public async create(req: Request, _res: Response): Promise<any> {
        const entity: T = this.repository.create(req.body as DeepPartial<T>);
        const saved = await this.repository.save(entity as any);
        return new ApiResponse(saved, {
            status: 201,
            type: "application/vnd.api+json"
        });
    }

    public async update(req: Request, _res: Response): Promise<any> {
        let saved = await this.repository.preload({
            ...req.body,
            ...{ id: req.params.id }
        });

        if (saved === undefined) {
            throw Boom.notFound();
        }

        saved = await this.repository.save(saved as any);

        return saved;
    }

    public async remove(req: Request, res: Response): Promise<any> {
        const entity: T = await this.repository.findOne(req.params.id);

        if (!entity) {
            throw Boom.notFound();
        }

        await this.repository.remove(entity);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async fetchRelationships(req: Request, res: Response) {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(
            relation
        )?.inverseEntityMetadata;

        if (!otherEntityMetadata) {
            throw Boom.notFound();
        }

        const relatedIds = await this.repository.fetchRelationshipsFromRequest(
            relation,
            req.params.id,
            this.parseJsonApiQueryParams(req.query)
        );

        res.type("application/vnd.api+json");
        return res.json(
            await ApplicationRegistry.serializerFor(
                otherEntityMetadata.target as any
            ).serialize(relatedIds, "relationships", {
                id: req.params.id,
                thisType: this.name,
                relationName: relation,
                url: req.url
            })
        );
    }

    public async fetchRelated(req: Request, res: Response): Promise<any> {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(
            relation
        )?.inverseEntityMetadata;

        if (!otherEntityMetadata) {
            throw Boom.notFound();
        }

        const useSchema =
            Reflect.getMetadata("schema-use", this, "fetchRelated") ??
            "default";

        res.type("application/vnd.api+json");
        return res.json(
            await ApplicationRegistry.serializerFor(
                otherEntityMetadata.target as any
            ).serialize(
                await this.repository.fetchRelated(
                    relation,
                    req.params.id,
                    this.parseJsonApiQueryParams(req.query)
                ),
                useSchema,
                {
                    url: req.url
                }
            )
        );
    }

    public async addRelationships(req: Request, res: Response): Promise<any> {
        const { relation, id } = req.params;

        await this.repository.addRelationshipsFromRequest(
            relation,
            id,
            req.body.data
        );
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async updateRelationships(
        req: Request,
        res: Response
    ): Promise<any> {
        const { relation, id } = req.params;

        await this.repository.updateRelationshipsFromRequest(
            relation,
            id,
            req.body.data
        );
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    public async removeRelationships(
        req: Request,
        res: Response
    ): Promise<any> {
        const { relation, id } = req.params;

        await this.repository.removeRelationshipsFromRequest(
            relation,
            id,
            req.body.data
        );
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }

    protected parseJsonApiQueryParams(query: Record<string, any>) {
        return {
            includes: query.include
                ? (query.include as string).split(",")
                : null,
            sort: query.sort ? (query.sort as string).split(",") : null,
            fields: query.fields ?? null,
            page: query.page ?? null,
            filter: query.filter ?? null
        };
    }
}
