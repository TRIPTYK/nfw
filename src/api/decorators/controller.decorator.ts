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

/**
 *
 * @param routeName
 */
export function RouteMiddleware(middlewareFunction, args?: any): ClassDecorator {
    return function <TFunction extends Function> (target: TFunction): void {
        if (! Reflect.hasMetadata("middlewares",  target)) {
            Reflect.defineMetadata("middlewares", [], target);
        }
        const middlewares = Reflect.getMetadata("middlewares", target);
        middlewares.push({middleware : middlewareFunction , args});
    };
}

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function MethodMiddleware(middlewareFunction, args?: any): MethodDecorator {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        if (! Reflect.hasMetadata("middlewares", target.constructor , propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor , propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor , propertyKey);
        middlewares.push({middleware : middlewareFunction , args});
    };
}

export type RequestMethods = "get" | "post" | "delete" | "options" | "put" | "patch";

export interface RouteDefinition {
    // Path to our route
    path: string;
    // HTTP Request method (get, post, ...)
    requestMethod: RequestMethods;
    // Method name within our class responsible for this route
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

    Reflect.defineMetadata("routes", routes, target.constructor);
};

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function Get(path: string = null): MethodDecorator {
    return registerMethod(path, "get");
}

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function Post(path: string = null): MethodDecorator {
    return registerMethod(path, "post");
}

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function Patch(path: string = null): MethodDecorator {
    return registerMethod(path, "patch");
}

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function Put(path: string = null): MethodDecorator {
    return registerMethod(path, "put");
}

/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function Delete(path: string = null): MethodDecorator {
    return registerMethod(path, "delete");
}
