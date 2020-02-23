import { BaseMiddleware } from "../middlewares/base.middleware";
import { Type } from "../types/global";

/**
 *
 * @param routeName
 */
export function Controller(routeName: string): ClassDecorator {
    return function <TFunction extends Function> (target: TFunction): void {
        Reflect.defineMetadata("routeName", routeName, target);

        if (! Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
}

export function RouteMiddleware(middlewareClass: Type<BaseMiddleware>, args?: any): ClassDecorator {
    return function <TFunction extends Function> (target: TFunction): void {
        if (! Reflect.hasMetadata("middlewares",  target)) {
            Reflect.defineMetadata("middlewares", [], target);
        }
        const middlewares = Reflect.getMetadata("middlewares", target);
        middlewares.push({middleware : middlewareClass , args});
    };
}

export function MethodMiddleware(middlewareClass: Type<BaseMiddleware>, args?: any): MethodDecorator {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor , propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor , propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor , propertyKey);
        middlewares.push({middleware : middlewareClass , args});
    };
}

export type RequestMethods = "get" | "post" | "delete" | "options" | "put" | "patch";

export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethods;
    methodName: string;
}

const registerMethod = (path: string = null , method: RequestMethods) =>
    function(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    if (! Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata("routes", target.constructor) as RouteDefinition[];

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
