import { BaseSerializer } from "../../api/serializers/base.serializer";
import { BaseRepository } from "../repositories/base.repository";
import { JsonApiRegistry } from "../application/registry.application";
import { BaseModel } from "../models/base.model";
import { Type } from "../types/global";

export default class JsonApiController<T extends BaseModel> {
    protected serializer: BaseSerializer<T>;
    protected repository: BaseRepository<T>;

    public constructor() {
        const entity: Type<T> = Reflect.getMetadata("entity",this);
        this.serializer = JsonApiRegistry.serializerFor(entity);
        this.repository = JsonApiRegistry.repositoryFor(entity);
    }
}
