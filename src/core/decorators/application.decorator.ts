/* eslint-disable @typescript-eslint/ban-types */

import { Type } from "../types/global";
import BaseService from "../services/base.service";

/**
 *
 * @param routeName
 */
export function RegisterApplication({controllers,services}: {controllers: Type<any>[];services: Type<BaseService>[]}): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("controllers", controllers, target);
        Reflect.defineMetadata("services", services, target);
    };
}
