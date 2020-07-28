import { BaseModel } from "../models/base.model";
import { Type } from "../types/global";
import { BaseRepository } from "../repositories/base.repository";
import { BaseSerializer } from "../../api/serializers/base.serializer";
import { getCustomRepository } from "typeorm";
import { container } from "tsyringe";

export class JsonApiRegistry {
    public static repositories: {[key: string]: Type<BaseRepository<any>>} = {};
    public static serializers: {[key: string]: Type<BaseSerializer<any>>} = {};

    public static repositoryFor<T extends BaseModel>(entity: Type<T>): BaseRepository<T> {
        return getCustomRepository(JsonApiRegistry.repositories[entity.name]);
    }

    public static serializerFor<T extends BaseModel>(entity: Type<T>): BaseSerializer<T> {
        return container.resolve(JsonApiRegistry.serializers[entity.name]);
    }

    public static registerCustomRepositoryFor<T extends BaseModel>(entity: Type<T>,repository: Type<BaseRepository<T>>) {
        JsonApiRegistry.repositories[entity.name] = repository;
    }

    public static registerSerializerFor<T extends BaseModel>(entity: Type<T>,serializer: Type<BaseSerializer<T>>) {
        JsonApiRegistry.serializers[entity.name] = serializer;
    }
}
