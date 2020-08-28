import { Type } from "../types/global";
import { BaseRepository } from "../repositories/base.repository";
import { BaseSerializer } from "../serializers/base.serializer";
import { getCustomRepository } from "typeorm";
import { container } from "tsyringe";
import { JsonApiModel } from "../models/json-api.model";
import BaseApplication from "./base.application";
import Constructor from "../types/constructor";
import BaseService from "../services/base.service";
import BaseController from "../controllers/base.controller";

/**
 * Init order :
 *  Services
 *  Controllers
 */

export class ApplicationRegistry {
    public static application: BaseApplication;
    public static entities: Type<JsonApiModel<any>>[] = [];
    public static repositories: {[key: string]: Type<BaseRepository<any>>} = {};
    public static serializers: {[key: string]: Type<BaseSerializer<any>>} = {};
    public static controllers: BaseController[] = [];

    public static async registerApplication<T extends BaseApplication>(app: Constructor<T>) {
        const services: Type<BaseService>[] = Reflect.getMetadata("services",app);
        const controllers: Type<BaseController>[] = Reflect.getMetadata("controllers",app);

        // services before all
        await Promise.all(services.map((service) => {
            container.registerSingleton(service);  // services are singletons
            return container.resolve(service).init();
        }));

        // app constructor
        const instance = ApplicationRegistry.application = new app();

        // init app
        await instance.init();

        // controllers
        await Promise.all(controllers.map((controller) => {
            return container.resolve(controller).init();
        }));

        // setup routes etc ...
        await instance.setupControllers(controllers);

        return instance;
    }

    public static registerEntity<T extends JsonApiModel<T>>(entity: Type<T>) {
        ApplicationRegistry.entities.push(entity);
    }

    public static repositoryFor<T extends JsonApiModel<T>>(entity: Type<T>): BaseRepository<T> {
        return getCustomRepository(ApplicationRegistry.repositories[entity.name]);
    }

    public static serializerFor<T extends JsonApiModel<T>>(entity: Type<T>): BaseSerializer<T> {
        return container.resolve(ApplicationRegistry.serializers[entity.name]);
    }

    public static registerController(controller: BaseController) {
        ApplicationRegistry.controllers.push(controller);
    }

    public static registerCustomRepositoryFor<T extends JsonApiModel<T>>(entity: Type<T>,repository: Type<BaseRepository<T>>) {
        ApplicationRegistry.repositories[entity.name] = repository;
    }

    public static registerSerializerFor<T extends JsonApiModel<T>>(entity: Type<T>,serializer: Type<BaseSerializer<T>>) {
        ApplicationRegistry.serializers[entity.name] = serializer;
    }
}
