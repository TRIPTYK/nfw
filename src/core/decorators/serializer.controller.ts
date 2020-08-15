/* eslint-disable @typescript-eslint/ban-types */

import { Type } from "../types/global";

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function Serialize(): PropertyDecorator {
    return function(target: object, propertyKey: string | symbol) {
        if (!Reflect.hasMetadata("serialize",target)) {
            Reflect.defineMetadata("serialize",[],target);
        }

        Reflect.getMetadata("serialize",target).push(propertyKey);
    }
}

export function Deserialize(): PropertyDecorator {
    return function(target: object, propertyKey: string | symbol) {
        if (!Reflect.hasMetadata("deserialize",target)) {
            Reflect.defineMetadata("deserialize",[],target);
        }

        Reflect.getMetadata("deserialize",target).push(propertyKey);
    }
}


export interface SchemaOptions {
    schemas: {
        name: string;
        schema: Type<any>;
    }[];
}

/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export function JsonApiSerializer(options: SchemaOptions): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction) {
        Reflect.defineMetadata("schemas",options,target.prototype);
    }
}

