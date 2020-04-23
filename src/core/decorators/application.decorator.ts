/* eslint-disable @typescript-eslint/ban-types */
import { Type } from "../types/global";

/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export function RegisterApplication(params: { providers: Type<any>[];controllers: Type<any>[] } =
{ providers : [] , controllers : [] }): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction): void {
        Reflect.defineMetadata("controllers", params.controllers, target);
        Reflect.defineMetadata("providers", params.providers, target);
    };
}
