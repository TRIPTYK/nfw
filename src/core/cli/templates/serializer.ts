import * as pluralize from "pluralize";
import { GeneratorParameters } from "../interfaces/generator.interface";
import project from "../utils/project";

export default function createSerializer({
    modelName,
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

    file.addImportDeclaration({
        namedImports: [classPrefixName],
        moduleSpecifier: `../models/${filePrefixName}.model`
    });

    const serializerClass = file.addClass({
        name: `${classPrefixName}Serializer`
    });

    serializerClass.setIsExported(true);
    serializerClass.setExtends(`BaseJsonApiSerializer<${classPrefixName}>`);

    serializerClass.addDecorator({
        name: "singleton",
        arguments: []
    });

    serializerClass.addDecorator({
        name: "JsonApiSerializer",
        arguments: [
            (writer) => {
                writer.block(() => {
                    writer.setIndentationLevel(1);
                    writer.writeLine(`type : "${pluralize(modelName)}",`);
                    writer.writeLine(
                        `schemas : () => [${classPrefixName}SerializerSchema]`
                    );
                });
            }
        ]
    });

    return file;
}
