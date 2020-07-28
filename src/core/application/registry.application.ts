import { BaseModel } from "../models/base.model";
import { Type } from "../types/global";
import { BaseRepository } from "../repositories/base.repository";
import { BaseSerializer } from "../../api/serializers/base.serializer";

interface EntityRegistry<T> {
    entity: Type<T>
    serializer?: Type<BaseSerializer<T>>
    repository?: Type<BaseRepository<T>>
}

export class JsonApiRegistry {
    public static entities: {[key: string]: EntityRegistry<any>} = {};

    public static registerEntity<T extends BaseModel>(entity: Type<T>,serializer: Type<BaseSerializer<T>>) {
        JsonApiRegistry.entities[Reflect.getMetadata("jsonApiEntity",entity).entityName] = {
            entity,
            serializer
        };
    }
}
