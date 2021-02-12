/* eslint-disable @typescript-eslint/ban-types */

import { EntityOptions, getMetadataArgsStorage } from "typeorm";
import { EntityRepositoryMetadataArgs } from "typeorm/metadata-args/EntityRepositoryMetadataArgs";
import { TableMetadataArgs } from "typeorm/metadata-args/TableMetadataArgs";
import { ApplicationRegistry } from "../application/registry.application";
import BaseJsonApiRepository from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";

export interface EntityOptionsExtended<T> extends EntityOptions {
    repository: Constructor<BaseJsonApiRepository<T>>;
    serializer: Constructor<BaseJsonApiSerializer<T>>;
    validator: any;
}

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function JsonApiEntity<T>(
    options?: EntityOptionsExtended<T>
): ClassDecorator;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function JsonApiEntity<T>(
    name?: string,
    options?: EntityOptionsExtended<T>
): ClassDecorator;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function JsonApiEntity<T>(
    nameOrOptions?: string | any,
    maybeOptions?: EntityOptionsExtended<T>
): ClassDecorator {
    const options =
        (typeof nameOrOptions === "object" ? nameOrOptions : maybeOptions) ||
        {};
    const name =
        typeof nameOrOptions === "string" ? nameOrOptions : options.name;

    return function (target) {
        getMetadataArgsStorage().tables.push({
            target,
            name,
            type: "regular",
            orderBy: options.orderBy ? options.orderBy : undefined,
            engine: options.engine ? options.engine : undefined,
            database: options.database ? options.database : undefined,
            schema: options.schema ? options.schema : undefined,
            synchronize: options.synchronize,
            withoutRowid: options.withoutRowid
        } as TableMetadataArgs);

        if (!options.repository || !options.serializer || !options.validator) {
            throw new Error("Please provide arguments for json-api entity");
        }

        Reflect.defineMetadata("name", name, target);
        Reflect.defineMetadata("repository", options.repository, target);
        Reflect.defineMetadata("serializer", options.serializer, target);
        Reflect.defineMetadata("validator", options.validator, target);

        getMetadataArgsStorage().entityRepositories.push({
            target: options.repository,
            entity: target
        } as EntityRepositoryMetadataArgs);

        ApplicationRegistry.registerEntity(target as any);
        ApplicationRegistry.registerCustomRepositoryFor(
            target as any,
            options.repository
        );
        ApplicationRegistry.registerSerializerFor(
            target as any,
            options.serializer
        );
    };
}
