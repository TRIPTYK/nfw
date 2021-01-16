/* eslint-disable @typescript-eslint/ban-types */

import { container } from "tsyringe";
import BaseSerializerSchema from "../serializers/base.serializer-schema";
import { Constructor } from "../types/global";

export interface RelationMetadata {
    type: () => Schema;
    property: string;
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function Serialize(): PropertyDecorator {
    return function (target: object, propertyKey: string | symbol) {
        if (!Reflect.hasMetadata("serialize", target)) {
            Reflect.defineMetadata("serialize", [], target);
        }

        Reflect.getMetadata("serialize", target).push(propertyKey);
    };
}

export function Deserialize(): PropertyDecorator {
    return function (target: object, propertyKey: string | symbol) {
        if (!Reflect.hasMetadata("deserialize", target)) {
            Reflect.defineMetadata("deserialize", [], target);
        }

        Reflect.getMetadata("deserialize", target).push(propertyKey);
    };
}

export function Relation(type: () => Schema): PropertyDecorator {
    return function (target: object, propertyKey: string) {
        if (!Reflect.hasMetadata("relations", target)) {
            Reflect.defineMetadata("relations", [], target);
        }

        const relations: RelationMetadata[] = Reflect.getMetadata(
            "relations",
            target
        );

        relations.push({
            type,
            property: propertyKey
        });
    };
}

export type Schema = Constructor<any>;

export interface SchemaOptions {
    schemas: () => Constructor<BaseSerializerSchema<any>>[];
    type: string;
}

/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export function JsonApiSerializer(options: SchemaOptions): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction) {
        container.registerSingleton(target as any);
        Reflect.defineMetadata("schemas", options, target.prototype);
    };
}

export function SerializerSchema(name = "default"): ClassDecorator {
    return function <TFunction extends Function>(target: TFunction) {
        Reflect.defineMetadata("name", name, target);
    };
}
