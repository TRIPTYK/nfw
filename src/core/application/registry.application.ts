/* eslint-disable no-console */
import { Type } from "../types/global";
import BaseJsonApiRepository from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { getCustomRepository } from "typeorm";
import { container } from "tsyringe";
import { JsonApiModel } from "../models/json-api.model";
import BaseApplication from "./base.application";
import Constructor from "../types/constructor";
import BaseService from "../services/base.service";
import BaseController from "../controllers/base.controller";

export class ApplicationRegistry {
    public static application: BaseApplication;
    public static entities: Type<JsonApiModel<any>>[] = [];
    public static repositories: {[key: string]: Type<BaseJsonApiRepository<any>>} = {};
    public static serializers: {[key: string]: Type<BaseJsonApiSerializer<any>>} = {};
    public static controllers: BaseController[] = [];

    public static async registerApplication<T extends BaseApplication>(app: Constructor<T>) {
        const services: Type<BaseService>[] = Reflect.getMetadata("services",app);
        const controllers: Type<BaseController>[] = Reflect.getMetadata("controllers",app);
        const middlewares: { middleware: any ; args: any ; order: "before" | "after" }[] = Reflect.getMetadata("middlewares",app) ?? [];

        // services before all
        await Promise.all(services.map((service) => container.resolve(service).init()));
        console.log("initialized services");

        // app constructor
        const instance = ApplicationRegistry.application = new app();
        console.log("construct app");

        // init app
        await instance.init();
        console.log("initialized app");

        // controllers
        await Promise.all(controllers.map((controller) => container.resolve(controller).init()));
        console.log("initialized controllers");

        // setup global middlewares
        await instance.setupMiddlewares(middlewares.filter(({order}) => order === "before"));

        // setup routes etc ...
        await instance.setupControllers(controllers);
        console.log("setup controllers");

        // setup global middlewares
        await instance.setupMiddlewares(middlewares.filter(({order}) => order === "after"));

        // afterInit hook
        await instance.afterInit();
        console.log("after init");

        return instance;
    }

    public static registerEntity<T extends JsonApiModel<T>>(entity: Type<T>) {
        ApplicationRegistry.entities.push(entity);
    }

    public static repositoryFor<T extends JsonApiModel<T>>(entity: Type<T>): BaseJsonApiRepository<T> {
        return getCustomRepository(ApplicationRegistry.repositories[entity.name]);
    }

    public static serializerFor<T extends JsonApiModel<T>>(entity: Type<T>): BaseJsonApiSerializer<T> {
        return container.resolve(ApplicationRegistry.serializers[entity.name]);
    }

    public static registerController(controller: BaseController) {
        ApplicationRegistry.controllers.push(controller);
    }

    public static registerCustomRepositoryFor<T extends JsonApiModel<T>>(entity: Type<T>,repository: Type<BaseJsonApiRepository<T>>) {
        ApplicationRegistry.repositories[entity.name] = repository;
    }

    public static registerSerializerFor<T extends JsonApiModel<T>>(entity: Type<T>,serializer: Type<BaseJsonApiSerializer<T>>) {
        ApplicationRegistry.serializers[entity.name] = serializer;
    }
}
