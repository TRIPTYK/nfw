/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable complexity */
import * as Express from "express";
import * as pluralize from "pluralize";
import { container } from "tsyringe";
import BaseController from "../controllers/base.controller";
import BaseJsonApiController from "../controllers/json-api.controller";
import {
    JsonApiMiddlewareMetadata,
    MiddlewareMetadata,
    RequestMethods,
    RouteDefinition
} from "../decorators/controller.decorator";
import ApplicationInterface from "../interfaces/application.interface";
import { BaseErrorMiddleware } from "../middlewares/base.error-middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { Constructor } from "../types/global";
import { toKebabCase } from "../utils/case.util";
import * as BaseValidation from "../validation/base.validation";

export interface RouteContext {
    routeDefinition: RouteDefinition;
    controllerInstance: BaseController;
}

export default abstract class BaseApplication implements ApplicationInterface {
    protected app: Express.Application;
    protected router: Express.Router;

    public constructor() {
        this.app = Express();
        this.router = Express.Router();
    }

    public async setupMiddlewares(
        middlewaresForApp: MiddlewareMetadata[]
    ): Promise<any> {
        const middlewaresToApply = middlewaresForApp.map((e) =>
            this.useMiddleware(e.middleware, e.args, null)
        );

        if (middlewaresToApply.length) {
            this.router.use(middlewaresToApply.reverse());
        }
    }

    public abstract afterInit(): Promise<any>;

    public async init(): Promise<any> {
        // eslint-disable-next-line no-useless-return
        return;
    }

    public get App() {
        return this.app;
    }

    public listen(port: number) {
        return new Promise((resolve) => {
            const server = this.app.listen(port, () => {
                resolve(server);
            });
        });
    }

    /**
     * Setup controllers routing
     */
    public async setupControllers(controllers: Constructor<BaseController>[]) {
        for (const controller of controllers) {
            const instanceController = container.resolve(controller);

            // The prefix saved to our controller
            const prefix = Reflect.getMetadata("routeName", controller);
            // Our `routes` array containing all our routes for this controller
            const routes: RouteDefinition[] = Reflect.getMetadata(
                "routes",
                controller
            );

            const middlewaresForController: MiddlewareMetadata[] =
                Reflect.getMetadata("middlewares", controller) ?? [];
            const router = Express.Router();

            if (
                middlewaresForController &&
                middlewaresForController.length > 0
            ) {
                middlewaresForController.reverse();
            }

            const jsonApiEntity = Reflect.getMetadata(
                "entity",
                instanceController
            );

            if (jsonApiEntity) {
                // is json-api controller
                const jsonApiEntityName = toKebabCase(
                    pluralize.plural(jsonApiEntity.name)
                ).toLowerCase();

                const serializer = Reflect.getMetadata(
                    "serializer",
                    jsonApiEntity
                );
                const validation = Reflect.getMetadata(
                    "validator",
                    jsonApiEntity
                );

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
                        middlewares: ["deserialize", "validation"]
                    },
                    {
                        path: "/:id",
                        methodType: "patch",
                        method: "update",
                        middlewares: ["deserialize", "validation"]
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

                for (const route of routes) {
                    const routeContext: RouteContext = {
                        routeDefinition: route,
                        controllerInstance: instanceController
                    };
                    let middlewaresWithArgs = Reflect.getMetadata(
                        "middlewares",
                        controller,
                        route.methodName
                    ) as MiddlewareMetadata[];

                    if (!middlewaresWithArgs) {
                        middlewaresWithArgs = [];
                    }

                    middlewaresWithArgs.reverse();

                    const middlewares = [];

                    for (const iterator of middlewaresForController.concat(
                        middlewaresWithArgs
                    )) {
                        // need to arrow function to keep "this" context in method
                        middlewares.push(
                            this.useMiddleware(
                                iterator.middleware,
                                iterator.args,
                                routeContext
                            )
                        );
                    }

                    middlewares.push(
                        (instanceController as BaseJsonApiController<any>).callMethod(
                            route.methodName
                        )
                    );

                    router[route.requestMethod](`${route.path}`, middlewares);
                }

                for (const {
                    path,
                    methodType,
                    method,
                    middlewares
                } of jsonApiRoutes) {
                    const routeContext: RouteContext = {
                        routeDefinition: {
                            path,
                            requestMethod: methodType as RequestMethods,
                            methodName: method
                        },
                        controllerInstance: instanceController
                    };
                    const applyMiddlewares = [];
                    const middlewaresWithArgs: JsonApiMiddlewareMetadata[] =
                        Reflect.getMetadata(
                            "middlewares",
                            controller,
                            method
                        ) ?? [];
                    const serializerOverride = Reflect.getMetadata(
                        "deserializer",
                        controller,
                        method
                    );
                    const validatorOverride = Reflect.getMetadata(
                        "validator",
                        controller,
                        method
                    );

                    const middlewaresByOrder = {
                        afterValidation: [],
                        beforeValidation: [],
                        afterDeserialization: [],
                        beforeDeserialization: [],
                        beforeAll: [],
                        afterAll: []
                    };

                    for (const middleware of middlewaresWithArgs) {
                        middlewaresByOrder[middleware.order ?? "afterAll"].push(
                            middleware
                        );
                    }

                    for (const beforeAllMiddleware of middlewaresByOrder.beforeAll.reverse()) {
                        applyMiddlewares.push(
                            this.useMiddleware(
                                beforeAllMiddleware.middleware,
                                beforeAllMiddleware.args,
                                routeContext
                            )
                        );
                    }

                    for (const middleware of middlewares) {
                        if (middleware === "deserialize") {
                            for (const beforeDeserializationMiddleware of middlewaresByOrder.beforeDeserialization.reverse()) {
                                applyMiddlewares.push(
                                    this.useMiddleware(
                                        beforeDeserializationMiddleware.middleware,
                                        beforeDeserializationMiddleware.args,
                                        routeContext
                                    )
                                );
                            }

                            const schema = serializerOverride
                                ? serializerOverride
                                : "default";

                            if (serializerOverride !== null) {
                                applyMiddlewares.push(
                                    this.useMiddleware(
                                        DeserializeMiddleware,
                                        {
                                            serializer,
                                            schema
                                        },
                                        routeContext
                                    )
                                );
                            }

                            for (const afterDeserializationMiddleware of middlewaresByOrder.afterDeserialization.reverse()) {
                                applyMiddlewares.push(
                                    this.useMiddleware(
                                        afterDeserializationMiddleware.middleware,
                                        afterDeserializationMiddleware.args,
                                        routeContext
                                    )
                                );
                            }
                        }

                        if (middleware === "validation") {
                            for (const beforeValidationMiddleware of middlewaresByOrder.beforeValidation.reverse()) {
                                applyMiddlewares.push(
                                    this.useMiddleware(
                                        beforeValidationMiddleware.middleware,
                                        beforeValidationMiddleware.args,
                                        routeContext
                                    )
                                );
                            }

                            const validationSchema = validatorOverride
                                ? validatorOverride
                                : validation[method] ?? BaseValidation[method];

                            if (validatorOverride !== null) {
                                applyMiddlewares.push(
                                    this.useMiddleware(
                                        ValidationMiddleware,
                                        {
                                            serializer,
                                            schema: validationSchema
                                        },
                                        routeContext
                                    )
                                );
                            }

                            for (const afterValidationMiddleware of middlewaresByOrder.afterValidation.reverse()) {
                                applyMiddlewares.push(
                                    this.useMiddleware(
                                        afterValidationMiddleware.middleware,
                                        afterValidationMiddleware.args,
                                        routeContext
                                    )
                                );
                            }
                        }
                    }

                    for (const afterAllMiddleware of middlewaresByOrder.afterAll.reverse()) {
                        applyMiddlewares.push(
                            this.useMiddleware(
                                afterAllMiddleware.middleware,
                                afterAllMiddleware.args,
                                routeContext
                            )
                        );
                    }

                    applyMiddlewares.push(
                        instanceController.callMethod(method)
                    );

                    router[methodType](
                        path,
                        middlewaresForController.map((mid) =>
                            this.useMiddleware(
                                mid.middleware,
                                mid.args,
                                routeContext
                            )
                        ),
                        applyMiddlewares
                    );
                }
            } else {
                this.router.use(`/${prefix}`, router);

                // Iterate over all routes and register them to our express application
                for (const route of routes) {
                    const routeContext: RouteContext = {
                        routeDefinition: route,
                        controllerInstance: instanceController
                    };
                    let middlewaresWithArgs = Reflect.getMetadata(
                        "middlewares",
                        controller,
                        route.methodName
                    ) as MiddlewareMetadata[];

                    if (!middlewaresWithArgs) {
                        middlewaresWithArgs = [];
                    }

                    middlewaresWithArgs.reverse();

                    const middlewares = [];

                    for (const iterator of middlewaresWithArgs) {
                        // need to arrow function to keep "this" context in method
                        middlewares.push(
                            this.useMiddleware(
                                iterator.middleware,
                                iterator.args,
                                routeContext
                            )
                        );
                    }

                    middlewares.push(
                        instanceController.callMethod(route.methodName)
                    );

                    router[route.requestMethod](`${route.path}`, middlewares);
                }
            }
        }
    }

    private useMiddleware = (
        middleware: Constructor<BaseMiddleware | BaseErrorMiddleware>,
        args: any,
        context: RouteContext
    ) => {
        const instance = new middleware();
        instance.init(context);
        container.registerInstance(middleware, instance);
        if (instance instanceof BaseMiddleware) {
            return (req, res, next) => {
                try {
                    return instance.use(req, res, next, args);
                } catch (e) {
                    return next(e);
                }
            };
        }
        if (instance instanceof BaseErrorMiddleware) {
            return (err, req, res, next) => {
                try {
                    return instance.use(err, req, res, next, args);
                } catch (e) {
                    return next(e);
                }
            };
        }
    };
}
