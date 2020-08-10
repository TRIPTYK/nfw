import { Type } from "../types/global";
import { BaseRepository } from "../repositories/base.repository";
import { BaseSerializer } from "../../api/serializers/base.serializer";
import { getCustomRepository } from "typeorm";
import { container } from "tsyringe";
import { JsonApiModel } from "../models/json-api.model";
import BaseApplication from "./base.application";
import Constructor from "../types/constructor";
import JsonApiController from "../controllers/json-api.controller";

export class ApplicationRegistry {
    public static application: BaseApplication;
    public static controllers: {[key: string]: Type<JsonApiController<any>>} = {};
    public static repositories: {[key: string]: Type<BaseRepository<any>>} = {};
    public static serializers: {[key: string]: Type<BaseSerializer<any>>} = {};

    public static async registerApplication<T extends BaseApplication>(app: Constructor<T>) {
        const instance = ApplicationRegistry.application = new app();
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await instance.init();
        return instance;
    }

    public static repositoryFor<T extends JsonApiModel<T>>(entity: Type<T>): BaseRepository<T> {
        return getCustomRepository(ApplicationRegistry.repositories[entity.name]);
    }

    public static serializerFor<T extends JsonApiModel<T>>(entity: Type<T>): BaseSerializer<T> {
        return container.resolve(ApplicationRegistry.serializers[entity.name]);
    }

    public static registerControllerFor<T extends JsonApiModel<T>>(entity: Type<T>,controller: Type<JsonApiController<T>>) {
        ApplicationRegistry.controllers[entity.name] = controller;
    }

    public static registerCustomRepositoryFor<T extends JsonApiModel<T>>(entity: Type<T>,repository: Type<BaseRepository<T>>) {
        ApplicationRegistry.repositories[entity.name] = repository;
    }

    public static registerSerializerFor<T extends JsonApiModel<T>>(entity: Type<T>,serializer: Type<BaseSerializer<T>>) {
        ApplicationRegistry.serializers[entity.name] = serializer;
    }
}
