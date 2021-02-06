/* eslint-disable @typescript-eslint/ban-types */

import { BaseErrorMiddleware } from "../middlewares/base.error-middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import BaseService from "../services/base.service";
import { Constructor } from "../types/global";

/**
 *
 * @param routeName
 */
export function RegisterApplication({
    controllers,
    services
}: {
    controllers: Constructor<any>[];
    services: Constructor<BaseService>[];
}): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("controllers", controllers, target);
        Reflect.defineMetadata("services", services, target);
    };
}

export function GlobalMiddleware(
    middleware: Constructor<BaseMiddleware | BaseErrorMiddleware>,
    args?: any,
    order: "before" | "after" = "before"
): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        if (Reflect.hasMetadata("middlewares", target)) {
            const middlewares = Reflect.getOwnMetadata("middlewares", target);
            middlewares.push({ middleware, args, order });
        } else {
            Reflect.defineMetadata(
                "middlewares",
                [{ middleware, args, order }],
                target
            );
        }
    };
}
