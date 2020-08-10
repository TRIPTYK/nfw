import { ApplicationRegistry } from "../application/registry.application";

export function JsonApiSerializer(entity: any): any {
    return function(target: any) {
        ApplicationRegistry.registerSerializerFor(entity,target);
    };
}
