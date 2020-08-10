import { getMetadataArgsStorage } from "typeorm"
import { EntityRepositoryMetadataArgs } from "typeorm/metadata-args/EntityRepositoryMetadataArgs";
import { JsonApiModel } from "../models/json-api.model";
import { Type } from "../types/global";
import { ApplicationRegistry } from "../application/registry.application";

export function JsonApiRepository<T extends JsonApiModel<T>>(entity?: Type<T>): any {
    return function(target: any) {
        Reflect.defineMetadata("entity",entity,target);
        ApplicationRegistry.registerCustomRepositoryFor(entity,target);
        getMetadataArgsStorage().entityRepositories.push({
            target,
            entity,
        } as EntityRepositoryMetadataArgs);
    };
}