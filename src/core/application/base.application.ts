/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable complexity */
import * as Express from "express";
import ApplicationInterface from "../interfaces/application.interface";
import { Type } from "../types/global";
import { RouteDefinition, MiddlewareOrder } from "../decorators/controller.decorator";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { container } from "tsyringe";
import * as pluralize from "pluralize";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import BaseController from "../controllers/base.controller";
import * as BaseValidation from "../validation/base.validation";
import { BaseErrorMiddleware } from "../middlewares/base.error-middleware";

export default abstract class BaseApplication implements ApplicationInterface {
    protected app: Express.Application;
    protected router: Express.Router;

    public constructor() {
        this.app = Express();
        this.router = Express.Router();
    }

    public async setupMiddlewares(middlewaresForApp: { middleware: any ; args: object }[]): Promise<any> {
        const middlewaresToApply = middlewaresForApp.map((e) => {
            const realMiddleware: BaseMiddleware | BaseErrorMiddleware = container.resolve(e.middleware);
            if (realMiddleware instanceof BaseErrorMiddleware) {
                return this.useErrorMiddleware(realMiddleware,e.args);
            }else{
                return this.useMiddleware(realMiddleware,e.args);
            }
        })

        if (middlewaresToApply.length) {
            this.router.use(middlewaresToApply.reverse());
        }

        return;
    }

    public async afterInit(): Promise<any> {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async init(): Promise<any> {
        return;
    }

    public get App() {
        return this.app;
    }

    public listen(port: number) {
        return new Promise((resolve) => {
            this.app.listen(port, (server) => {
                resolve(server);
            });
        })
    }

    /**
     * Setup controllers routing
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    public async setupControllers(controllers: Type<BaseController>[]) {
        for (const controller of controllers) {
            const instanceController = container.resolve(controller);

            // The prefix saved to our controller
            const prefix = Reflect.getMetadata("routeName", controller);
            // Our `routes` array containing all our routes for this controller
            const routes: RouteDefinition[] = Reflect.getMetadata("routes", controller);

            const middlewaresForController: { middleware: any ; args: object }[] = Reflect.getMetadata("middlewares", controller);
            const router = Express.Router();

            if (middlewaresForController && middlewaresForController.length > 0) {
                middlewaresForController.reverse();
                router.use(middlewaresForController.map((e) => {
                    const realMiddleware: BaseMiddleware = container.resolve(e.middleware);
                    return this.useMiddleware(realMiddleware,e.args);
                }));
            }

            const jsonApiEntity = Reflect.getMetadata("entity",instanceController);

            if (jsonApiEntity) { // is json-api controller
                const jsonApiEntityName = pluralize.plural(jsonApiEntity.name.toLowerCase());

                const serializer =  Reflect.getMetadata("serializer",jsonApiEntity);
                const validation =  Reflect.getMetadata("validator",jsonApiEntity);

                this.router.use(`/${jsonApiEntityName}`, router);

                const jsonApiRoutes = [
                    {
                        path: "/:id",
                        methodType: "get",
                        method: "get",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/",
                        methodType: "get",
                        method: "list",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/",
                        methodType: "post",
                        method: "create",
                        middlewares: ["deserialize","validation"]
                    },
                    {
                        path: "/:id",
                        methodType: "patch",
                        method: "update",
                        middlewares: ["deserialize","validation"]
                    },
                    {
                        path: "/:id",
                        methodType: "delete",
                        method: "remove",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/:id/:relation",
                        methodType: "get",
                        method: "fetchRelated",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/:id/relationships/:relation",
                        methodType: "get",
                        method: "fetchRelationships",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/:id/relationships/:relation",
                        methodType: "post",
                        method: "addRelationships",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/:id/relationships/:relation",
                        methodType: "patch",
                        method: "updateRelationships",
                        middlewares: ["validation"]
                    },
                    {
                        path: "/:id/relationships/:relation",
                        methodType: "delete",
                        method: "removeRelationships",
                        middlewares: ["validation"]
                    }
                ];

                const deserializeMiddleware = container.resolve(DeserializeMiddleware);
                const validationMiddleware = container.resolve(ValidationMiddleware);

                for (const route of routes) {
                    let middlewaresWithArgs =
                        Reflect.getMetadata("middlewares", controller , route.methodName) as { middleware: any ; args: object }[];

                    if (!middlewaresWithArgs) {
                        middlewaresWithArgs = [];
                    }

                    middlewaresWithArgs.reverse();

                    const middlewares = [];

                    for (const iterator of middlewaresWithArgs) {
                        const realMiddleware: BaseMiddleware = container.resolve(iterator.middleware);

                        // need to arrow function to keep "this" context in method
                        middlewares.push(this.useMiddleware(realMiddleware,iterator.args));
                    }

                    middlewares.push(instanceController.callMethod(route.methodName));

                    router[route.requestMethod](`${route.path}`, middlewares);
                }

                for (const {path,methodType,method,middlewares} of jsonApiRoutes) {
                    const applyMiddlewares = [];
                    const middlewaresWithArgs: { middleware: any ; args: object ; order: MiddlewareOrder }[] = Reflect.getMetadata("middlewares", controller , method) ?? [];
                    const serializerOverride = Reflect.getMetadata("deserializer",controller , method);
                    const validatorOverride = Reflect.getMetadata("validator",controller , method);

                    const middlewaresByOrder = {
                        afterValidation: [],
                        beforeValidation: [],
                        afterDeserialization: [],
                        beforeDeserialization: [],
                        beforeAll: [],
                        afterAll: []
                    };

                    for (const middleware of middlewaresWithArgs) {
                        middlewaresByOrder[middleware.order ?? "afterAll"].push(middleware);
                    }

                    for (const beforeAllMiddleware of middlewaresByOrder["beforeAll"].reverse()) {
                        applyMiddlewares.push(this.useMiddleware(container.resolve(beforeAllMiddleware.middleware),beforeAllMiddleware.args));
                    }

                    for (const middleware of middlewares) {
                        if (middleware === "deserialize") {
                            for (const beforeDeserializationMiddleware of middlewaresByOrder["beforeDeserialization"].reverse()) {
                                applyMiddlewares.push(this.useMiddleware(container.resolve(beforeDeserializationMiddleware.middleware),beforeDeserializationMiddleware.args));
                            }

                            const schema = serializerOverride ? serializerOverride : "default";

                            if (serializerOverride !== null) {
                                applyMiddlewares.push(this.useMiddleware(deserializeMiddleware,{
                                    serializer,
                                    schema
                                }));
                            }

                            for (const afterDeserializationMiddleware of middlewaresByOrder["afterDeserialization"].reverse()) {
                                applyMiddlewares.push(this.useMiddleware(container.resolve(afterDeserializationMiddleware.middleware),afterDeserializationMiddleware.args));
                            }
                        }

                        if (middleware === "validation") {
                            for (const beforeValidationMiddleware of middlewaresByOrder["beforeValidation"].reverse()) {
                                applyMiddlewares.push(this.useMiddleware(container.resolve(beforeValidationMiddleware.middleware),beforeValidationMiddleware.args));
                            }

                            const validationSchema = validatorOverride ? validatorOverride : validation[method] ?? BaseValidation[method];

                            if (validatorOverride !== null) {
                                applyMiddlewares.push(this.useMiddleware(validationMiddleware,{
                                    serializer,
                                    schema : validationSchema
                                }));
                            }

                            for (const afterValidationMiddleware of middlewaresByOrder["afterValidation"].reverse()) {
                                applyMiddlewares.push(this.useMiddleware(container.resolve(afterValidationMiddleware.middleware),afterValidationMiddleware.args));
                            }
                        }
                    }

                    for (const afterAllMiddleware of middlewaresByOrder["afterAll"].reverse()) {
                        applyMiddlewares.push(this.useMiddleware(container.resolve(afterAllMiddleware.middleware),afterAllMiddleware.args));
                    }

                    applyMiddlewares.push(instanceController.callMethod(method));

                    router[methodType](path,applyMiddlewares);
                }
            }else{
                this.router.use(`/${prefix}`, router);

                // Iterate over all routes and register them to our express application
                for (const route of routes) {
                    let middlewaresWithArgs =
                        Reflect.getMetadata("middlewares", controller , route.methodName) as { middleware: any ; args: object }[];

                    if (!middlewaresWithArgs) {
                        middlewaresWithArgs = [];
                    }

                    middlewaresWithArgs.reverse();

                    const middlewares = [];

                    for (const iterator of middlewaresWithArgs) {
                        const realMiddleware: BaseMiddleware = container.resolve(iterator.middleware);

                        // need to arrow function to keep "this" context in method
                        middlewares.push(this.useMiddleware(realMiddleware,iterator.args));
                    }

                    middlewares.push(instanceController.callMethod(route.methodName));

                    router[route.requestMethod](`${route.path}`, middlewares);
                }
            }
        }
    }

    private useMiddleware = (middleware: BaseMiddleware,args: any) => (req, res, next) => {
        try {
            return middleware.use(req, res, next, args);
        } catch (e) {
            return next(e);
        }
    };

    private useErrorMiddleware = (middleware: BaseErrorMiddleware,args: any) => (err,req, res, next) => {
        try {
            return middleware.use(err,req, res, next, args);
        } catch (e) {
            return next(e);
        }
    };
}
