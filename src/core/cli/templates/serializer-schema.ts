import { GeneratorParameters } from "../interfaces/generator.interface";
import project from "../utils/project";

export default function createSerializerSchema({
    fileTemplateInfo,
    classPrefixName,
    filePrefixName
}: GeneratorParameters) {
    const file = project.createSourceFile(
        `${fileTemplateInfo.path}/${fileTemplateInfo.name}`,
        null,
        {
            overwrite: true
        }
    );

    const addedClass = file.addClass({
        name: `${classPrefixName}SerializerSchema`,
        isDefaultExport: true
    });

    file.addImportDeclaration({
        namedImports: [`${classPrefixName}Interface`],
        moduleSpecifier: `../../models/${filePrefixName}.model`
    });

    file.addImportDeclaration({
        namedImports: [
            "Serialize",
            "Deserialize",
            "SerializerSchema",
            "Relation"
        ],
        moduleSpecifier: "../../../core/decorators/serializer.decorator"
    });

    addedClass.setExtends(`BaseSerializerSchema<${classPrefixName}Interface>`);
    addedClass.addImplements(`${classPrefixName}Interface`);

    addedClass
        .addDecorator({
            name: "SerializerSchema",
            arguments: []
        })
        .setIsDecoratorFactory(true);

    return file;
}
