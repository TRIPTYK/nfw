import { getMetadataArgsStorage } from "typeorm"
import { JsonApiRegistry } from "../application/registry.application";
import { EntityRepositoryMetadataArgs } from "typeorm/metadata-args/EntityRepositoryMetadataArgs";

export function JsonApiRepository(entity?: any): any {
    return function(target: any) {
        JsonApiRegistry.registerCustomRepositoryFor(entity,target);
        getMetadataArgsStorage().entityRepositories.push({
            target,
            entity,
        } as EntityRepositoryMetadataArgs);
    };
}