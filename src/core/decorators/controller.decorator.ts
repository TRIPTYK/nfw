/* eslint-disable @typescript-eslint/ban-types */
import { BaseMiddleware } from "../middlewares/base.middleware";
import { Type } from "../types/global";
import { JsonApiModel } from "../models/json-api.model";

/**
 *
 * @param routeName
 */
export function Controller(routeName: string): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("routeName", routeName, target);

        if (! Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
}

/**
 *
 * @param routeName
 */
export function RegisterApplication({controllers}: {controllers: Type<any>[]}): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("controllers", controllers, target.prototype);
    };
}


/**
 *
 * @param routeName
 */
export function JsonApiController<T extends JsonApiModel<T>>(entity: Type<T>): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("entity", entity, target.prototype);

        if (! Reflect.hasMetadata("routes", target)) {
            const routes: RouteDefinition[] = [
                {
                    methodName : "get",
                    requestMethod : "get",
                    path: "/:id",
                },{
                    methodName : "list",
                    requestMethod : "get",
                    path: "/",
                },
                {
                    methodName : "fetchRelated",
                    requestMethod : "get",
                    path: "/:id",
                },{
                    methodName : "fetchRelationships",
                    requestMethod : "get",
                    path: "/",
                },
                {
                    methodName : "create",
                    requestMethod : "get",
                    path: "/:id",
                },{
                    methodName : "update",
                    requestMethod : "get",
                    path: "/",
                },
                {
                    methodName : "delete",
                    requestMethod : "get",
                    path: "/",
                },
                {
                    methodName : "update",
                    requestMethod : "get",
                    path: "/",
                }];
            Reflect.defineMetadata("routes", routes, target);
        }

    };
}

export function RouteMiddleware(middlewareClass: Type<BaseMiddleware>, args?: any): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        if (! Reflect.hasMetadata("middlewares",  target)) {
            Reflect.defineMetadata("middlewares", [], target);
        }
        const middlewares = Reflect.getMetadata("middlewares", target);
        middlewares.push({middleware : middlewareClass , args});
    };
}

export function MethodMiddleware(middlewareClass: Type<BaseMiddleware>, args?: any): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor , propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor , propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor , propertyKey);
        middlewares.push({middleware : middlewareClass , args});
    };
}

export function DeserializeJsonApi(schema = "default"): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor , propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor , propertyKey);
        }

        const middlewares = Reflect.getMetadata("middlewares", target.constructor , propertyKey);
        middlewares.push({middleware : "deserialize" , schema});
    };
}

export function ValidateJsonApi(schema = "default"): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor , propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor , propertyKey);
        }

        const middlewares = Reflect.getMetadata("middlewares", target.constructor , propertyKey);
        middlewares.push({middleware : "validate" , args : propertyKey});
    };
}


export type RequestMethods = "get" | "post" | "delete" | "options" | "put" | "patch";

export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethods;
    methodName: string;
}

const registerMethod = (path: string = null , method: RequestMethods) =>
    function(target: any, propertyKey: string): void {

        if (! Reflect.hasMetadata("routes", target.constructor)) {
            Reflect.defineMetadata("routes", [], target.constructor);
        }

        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata("routes", target.constructor) as RouteDefinition[];

        const alreadyExists = routes.findIndex((route) => route.methodName === propertyKey);

        if (alreadyExists >= 0) {
            routes.splice(alreadyExists,1);
        }

        routes.push({
            methodName: propertyKey,
            path : path ? path : `/${propertyKey}`,
            requestMethod: method,
        });
    };

export function Get(path: string = null): MethodDecorator {
    return registerMethod(path, "get");
}

export function Post(path: string = null): MethodDecorator {
    return registerMethod(path, "post");
}

export function Patch(path: string = null): MethodDecorator {
    return registerMethod(path, "patch");
}

export function Put(path: string = null): MethodDecorator {
    return registerMethod(path, "put");
}

export function Delete(path: string = null): MethodDecorator {
    return registerMethod(path, "delete");
}
