/* eslint-disable @typescript-eslint/ban-types */

import { Type } from "../types/global";
import BaseService from "../services/base.service";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { BaseErrorMiddleware } from "../middlewares/base.error-middleware";

/**
 *
 * @param routeName
 */
export function RegisterApplication({controllers, services}: {controllers: Type<any>[];services: Type<BaseService>[]}): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("controllers", controllers, target);
        Reflect.defineMetadata("services", services, target);
    };
}


export function GlobalMiddleware(middleware: Type<BaseMiddleware | BaseErrorMiddleware>, args?: any, order: "before" | "after" = "before"): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        if (Reflect.hasMetadata("middlewares", target)) {
            const middlewares = Reflect.getOwnMetadata("middlewares", target);
            middlewares.push({middleware, args, order});
        }else{
            Reflect.defineMetadata("middlewares", [{middleware, args, order}], target);
        }
    };
}
