import { ApplicationRegistry } from "../application/registry.application";

export function JsonApiSerializer(entity: any): any {
    return function(target: any) {
        console.log(entity);
        ApplicationRegistry.registerSerializerFor(entity,target);
    };
}
