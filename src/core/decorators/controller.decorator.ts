/* eslint-disable @typescript-eslint/ban-types */
import { BaseMiddleware } from "../middlewares/base.middleware";
import { Type } from "../types/global";
import { JsonApiModel } from "../models/json-api.model";
import { ValidationSchema } from "../types/validation";

export type RequestMethods = "get" | "post" | "delete" | "options" | "put" | "patch";

export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethods;
    methodName: string;
}

export interface MiddlewareMetadata {
    middleware: Type<BaseMiddleware>,
    args?: any
}

export interface JsonApiMiddlewareMetadata extends MiddlewareMetadata {
    order: MiddlewareOrder
}

export type MiddlewareOrder = "afterValidation" | "beforeValidation" | "afterDeserialization" | "beforeDeserialization" | "beforeAll" | "afterAll";

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
export function JsonApiController<T extends JsonApiModel<T>>(entity: Type<T>): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("entity", entity, target.prototype);

        if (! Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
}

export function RouteMiddleware<T = any>(middlewareClass: Type<BaseMiddleware>, args?: T): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        if (! Reflect.hasMetadata("middlewares", target)) {
            Reflect.defineMetadata("middlewares", [], target);
        }
        const middlewares = Reflect.getMetadata("middlewares", target) as MiddlewareMetadata[];
        middlewares.push({middleware : middlewareClass, args});
    };
}

export function MethodMiddleware<T = any>(middlewareClass: Type<BaseMiddleware>, args?: T): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor, propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor, propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor, propertyKey) as MiddlewareMetadata[];
        middlewares.push({middleware : middlewareClass, args});
    };
}

export function JsonApiMethodMiddleware<T = any>(middlewareClass: Type<BaseMiddleware>, args?: T, order: MiddlewareOrder = "afterAll"): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor, propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor, propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor, propertyKey) as JsonApiMiddlewareMetadata[];
        middlewares.push({middleware : middlewareClass, args, order});
    };
}

export function OverrideSerializer(schema = "default"): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        Reflect.defineMetadata("deserializer", schema, target.constructor, propertyKey);
        Reflect.defineMetadata("schema-use", schema, target, propertyKey);
    };
}

export function OverrideValidator<T>(schema: ValidationSchema<T>): MethodDecorator {
    return function(target: any, propertyKey: string): void {
        Reflect.defineMetadata("validator", schema, target.constructor, propertyKey);
    };
}

const registerMethod = (path: string = null, method: RequestMethods) =>
    function(target: any, propertyKey: string): void {

        if (! Reflect.hasMetadata("routes", target.constructor)) {
            Reflect.defineMetadata("routes", [], target.constructor);
        }

        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata("routes", target.constructor) as RouteDefinition[];

        const alreadyExists = routes.findIndex((route) => route.methodName === propertyKey);

        if (alreadyExists >= 0) {
            routes.splice(alreadyExists, 1);
        }

        routes.push({
            methodName: propertyKey,
            path : path ? path : `/${propertyKey}`,
            requestMethod: method
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
