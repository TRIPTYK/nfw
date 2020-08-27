/* eslint-disable complexity */
import * as Express from "express";
import ApplicationInterface from "../interfaces/application.interface";
import { ApplicationRegistry } from "./registry.application";
import { Type } from "../types/global";
import { RouteDefinition, MiddlewareOrder } from "../decorators/controller.decorator";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { container } from "tsyringe";
import * as pluralize from "pluralize";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import BaseController from "../controllers/base.controller";
import * as BaseValidation from "../validation/base.validation";

export default abstract class BaseApplication implements ApplicationInterface{
    protected app: Express.Application;
    protected router: Express.Router;

    public constructor() {
        this.app = Express();
        this.router = Express.Router();
    }

    public init() {
        this.setupControllers();
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

    protected setupControllers() {
        const controllers: Type<BaseController>[] = Reflect.getMetadata("controllers",this);

        for (const controller of controllers) {
            const instanceController = new controller();

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

                    return (req, res, next) => {
                        try {
                            return realMiddleware.use(req, res, next, e.args);
                        } catch (error) {
                            return next(error);
                        }
                    };
                }));
            }

            const useMiddleware = (middleware: BaseMiddleware,args: any) => (req, res, next) => {
                try {
                    return middleware.use(req, res, next, args);
                } catch (e) {
                    return next(e);
                }
            };

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
                    }
                ];

                const deserializeMiddleware = container.resolve(DeserializeMiddleware);
                const validationMiddleware = container.resolve(ValidationMiddleware);

                for (const {path,methodType,method,middlewares} of jsonApiRoutes) {
                    console.log(jsonApiEntityName,`[${methodType}] /${jsonApiEntityName}${path}`,middlewares);

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

                    for (const beforeAllMiddleware of middlewaresByOrder["beforeAll"]) {
                        applyMiddlewares.push(useMiddleware(container.resolve(beforeAllMiddleware.middleware),beforeAllMiddleware.args));
                    }

                    for (const middleware of middlewares) {
                        if (middleware === "deserialize") {
                            for (const beforeDeserializationMiddleware of middlewaresByOrder["beforeDeserialization"]) {
                                applyMiddlewares.push(useMiddleware(container.resolve(beforeDeserializationMiddleware.middleware),beforeDeserializationMiddleware.args));
                            }

                            const schema = serializerOverride ? serializerOverride : "default";

                            if (serializerOverride !== null) {
                                applyMiddlewares.push(useMiddleware(deserializeMiddleware,{
                                    serializer,
                                    schema
                                }));
                            }

                            for (const afterDeserializationMiddleware of middlewaresByOrder["afterDeserialization"]) {
                                applyMiddlewares.push(useMiddleware(container.resolve(afterDeserializationMiddleware.middleware),afterDeserializationMiddleware.args));
                            }
                        }

                        if (middleware === "validation") {
                            for (const beforeValidationMiddleware of middlewaresByOrder["beforeValidation"]) {
                                applyMiddlewares.push(useMiddleware(container.resolve(beforeValidationMiddleware.middleware),beforeValidationMiddleware.args));
                            }

                            const validationSchema = validatorOverride ? validatorOverride : validation[method] ?? BaseValidation[method];

                            if (validatorOverride !== null) {
                                applyMiddlewares.push(useMiddleware(validationMiddleware,{
                                    serializer,
                                    schema : validationSchema
                                }));
                            }

                            for (const afterValidationMiddleware of middlewaresByOrder["afterValidation"]) {
                                applyMiddlewares.push(useMiddleware(container.resolve(afterValidationMiddleware.middleware),afterValidationMiddleware.args));
                            }
                        }
                    }

                    for (const afterAllMiddleware of middlewaresByOrder["afterAll"]) {
                        applyMiddlewares.push(useMiddleware(container.resolve(afterAllMiddleware.middleware),afterAllMiddleware.args));
                    }

                    applyMiddlewares.push(instanceController.callMethod(method));

                    router[methodType](path,applyMiddlewares);
                }

                // router.get("/:id/:relation", controllerMiddleware("fetchRelated"));
                // router.get("/:id/relationships/:relation", controllerMiddleware("fetchRelationsships"));
                // router.post("/:id/relationships/:relation", controllerMiddleware("addRelationships"));
                // router.patch("/:id/relationships/:relation", controllerMiddleware("updateRelationships"));
                // router.delete("/:id/:relation", controllerMiddleware("removeRelationships"));
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
                        middlewares.push(useMiddleware(realMiddleware,iterator.args));
                    }

                    middlewares.push(instanceController.callMethod(route.methodName));

                    router[route.requestMethod](`${route.path}`, middlewares);
                }
            }
        }
    }
}
