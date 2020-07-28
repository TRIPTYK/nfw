import { JsonApiRegistry } from "../application/registry.application";

export function JsonApiSerializer(entity: any): any {
    return function(target: any) {
        JsonApiRegistry.registerSerializerFor(entity,target);
    };
}
