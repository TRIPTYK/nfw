import project = require("../utils/project");
import { GeneratorParameters } from "../interfaces/generator.interface";
import * as pluralize from "pluralize";

export default function createSerializer({modelName,fileTemplateInfo,classPrefixName,filePrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    file.addImportDeclaration({
        namedImports : [classPrefixName],
        moduleSpecifier : `../models/${filePrefixName}.model`
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
                    writer.writeLine(`schemas : () => [${classPrefixName}SerializerSchema]`);
                });
            }]
    });

    return file;
}

