import kebabCase from "@queso/kebab-case";
import * as pascalcase from "pascalcase";

export interface TemplateStructureInterface {
    template: string;
    path: string;
    name: string;
}

export function getEntityNaming(entity: string) {
    return {
        classPrefixName: pascalcase(entity),
        filePrefixName: kebabCase(entity),
        entity: entity.toLowerCase()
    };
}

export default (entity: string): TemplateStructureInterface[] => {
    const { filePrefixName } = getEntityNaming(entity);
    return [
        {
            template: "controller",
            path: "src/api/controllers",
            name: `${filePrefixName}.controller.ts`
        },
        {
            template: "repository",
            path: "src/api/repositories",
            name: `${filePrefixName}.repository.ts`
        },
        {
            template: "validation",
            path: "src/api/validations",
            name: `${filePrefixName}.validation.ts`
        },
        {
            template: "serializer-schema",
            path: "src/api/serializers/schemas",
            name: `${filePrefixName}.serializer.schema.ts`
        },
        { template: "test", path: "test", name: `${filePrefixName}.test.ts` },
        {
            template: "serializer",
            path: "src/api/serializers",
            name: `${filePrefixName}.serializer.ts`
        },
        {
            template: "model",
            path: "src/api/models",
            name: `${filePrefixName}.model.ts`
        }
    ];
};
