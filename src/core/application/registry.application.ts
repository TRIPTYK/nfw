/* eslint-disable no-console */
import { EventEmitter } from "events";
import { container } from "tsyringe";
import { getCustomRepository } from "typeorm";
import { v4 } from "uuid";
import BaseController from "../controllers/base.controller";
import { JsonApiModel } from "../models/json-api.model";
import BaseJsonApiRepository from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import BaseService from "../services/base.service";
import { Constructor } from "../types/global";
import { mesure } from "../utils/mesure.util";
import BaseApplication from "./base.application";

export enum ApplicationStatus {
    Booting = "BOOTING",
    Running = "RUNNING",
    None = "NONE"
}

export enum ApplicationLifeCycleEvent {
    Boot = "BOOT",
    Running = "RUNNING"
}

export class ApplicationRegistry {
    public static application: BaseApplication;
    public static entities: Constructor<JsonApiModel<any>>[] = [];
    public static repositories: {
        [key: string]: Constructor<BaseJsonApiRepository<any>>;
    } = {};
    public static serializers: {
        [key: string]: Constructor<BaseJsonApiSerializer<any>>;
    } = {};
    public static controllers: BaseController[] = [];
    public static status: ApplicationStatus = ApplicationStatus.None;
    public static guid = v4();
    private static eventEmitter: EventEmitter = new EventEmitter();

    public static on(event: ApplicationLifeCycleEvent, callback) {
        ApplicationRegistry.eventEmitter.on(event, callback);
    }

    public static async registerApplication<T extends BaseApplication>(
        app: Constructor<T>
    ) {
        ApplicationRegistry.eventEmitter.emit(ApplicationLifeCycleEvent.Boot);
        ApplicationRegistry.status = ApplicationStatus.Booting;
        const services: Constructor<BaseService>[] = Reflect.getMetadata(
            "services",
            app
        );
        const controllers: Constructor<BaseController>[] = Reflect.getMetadata(
            "controllers",
            app
        );
        const middlewares: {
            middleware: any;
            args: any;
            order: "before" | "after";
        }[] = Reflect.getMetadata("middlewares", app) ?? [];

        const startTime = Date.now();

        // services before all
        let time = await mesure(async () => {
            await Promise.all(
                services.map((service) => container.resolve(service).init())
            );
        });
        console.log(`[${time}ms] initialized ${services.length} services`);

        const instance = (ApplicationRegistry.application = new app());
        // app constructor
        time = await mesure(async () => {
            await instance.init();
        });
        console.log(`[${time}ms] initialized app instance`);

        // controllers
        time = await mesure(async () => {
            await Promise.all(
                controllers.map((controller) =>
                    container.resolve(controller).init()
                )
            );
        });
        console.log(
            `[${time}ms] initialized ${controllers.length} controllers`
        );

        // serializers
        const serializers = Object.values(ApplicationRegistry.serializers);
        time = await mesure(async () => {
            for (const serializer of serializers) {
                container.resolve(serializer).init();
            }
        });
        console.log(
            `[${time}ms] initialized ${serializers.length} serializers`
        );

        // setup global middlewares
        time = await mesure(async () => {
            await instance.setupMiddlewares(
                middlewares.filter(({ order }) => order === "before")
            );
        });
        console.log(
            `[${time}ms] initialized ${middlewares.length} "before" global middlewares`
        );

        // setup routes etc ...
        time = await mesure(async () => {
            await instance.setupControllers(controllers);
        });
        console.log(`[${time}ms] setup controllers and routing`);

        // setup global middlewares
        time = await mesure(async () => {
            await instance.setupMiddlewares(
                middlewares.filter(({ order }) => order === "after")
            );
        });
        console.log(
            `[${time}ms] initialized ${middlewares.length} "after" global middlewares`
        );

        // afterInit hook
        time = await mesure(async () => {
            await instance.afterInit();
        });

        ApplicationRegistry.status = ApplicationStatus.Running;
        ApplicationRegistry.eventEmitter.emit(
            ApplicationLifeCycleEvent.Running
        );

        console.log(`[${time}ms] after init`);

        console.log(
            "Server initialized and ready in",
            Date.now() - startTime,
            "ms"
        );

        return instance;
    }

    public static registerEntity<T extends JsonApiModel<T>>(
        entity: Constructor<T>
    ) {
        ApplicationRegistry.entities.push(entity);
    }

    public static repositoryFor<T extends JsonApiModel<T>>(
        entity: Constructor<T>
    ): BaseJsonApiRepository<T> {
        return getCustomRepository(
            ApplicationRegistry.repositories[entity.name]
        );
    }

    public static serializerFor<T extends JsonApiModel<T>>(
        entity: Constructor<T>
    ): BaseJsonApiSerializer<T> {
        return container.resolve(ApplicationRegistry.serializers[entity.name]);
    }

    public static registerController(controller: BaseController) {
        ApplicationRegistry.controllers.push(controller);
    }

    public static registerCustomRepositoryFor<T extends JsonApiModel<T>>(
        entity: Constructor<T>,
        repository: Constructor<BaseJsonApiRepository<T>>
    ) {
        ApplicationRegistry.repositories[entity.name] = repository;
    }

    public static registerSerializerFor<T extends JsonApiModel<T>>(
        entity: Constructor<T>,
        serializer: Constructor<BaseJsonApiSerializer<T>>
    ) {
        ApplicationRegistry.serializers[entity.name] = serializer;
    }
}
