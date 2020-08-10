import { BaseSerializer } from "../../api/serializers/base.serializer";
import { BaseRepository } from "../repositories/base.repository";
import { Type } from "../types/global";
import ControllerInterface from "../interfaces/controller.interface";
import { JsonApiModel } from "../models/json-api.model";
import { Request , Response } from "express";
import { ApplicationRegistry } from "../application/registry.application";

export default abstract class JsonApiController<T extends JsonApiModel<T>> implements ControllerInterface {
    protected serializer: BaseSerializer<T>;
    protected repository: BaseRepository<T>;

    public constructor() {
        const entity: Type<T> = Reflect.getMetadata("entity",this);
        this.serializer = ApplicationRegistry.serializerFor(entity);
        this.repository = ApplicationRegistry.repositoryFor(entity);
        console.log("initialized controller");
    }

    public async fetchRelationships(req: Request, res: Response) {
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
}
