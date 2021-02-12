import * as pluralize from "pluralize";
import { SourceFile } from "ts-morph";
import { GeneratorParameters } from "../interfaces/generator.interface";
import project from "../utils/project";

/**
 *
 * @param path
 * @param className
 * @param {array} entities
 * @return {SourceFile}
 */
export default function createModelTemplate({
    fileTemplateInfo,
    classPrefixName,
    modelName,
    filePrefixName
}: GeneratorParameters): SourceFile {
    const file = project.createSourceFile(
        `${fileTemplateInfo.path}/${fileTemplateInfo.name}`,
        null,
        {
            overwrite: true
        }
    );

    const interfaceNameForModel = `${classPrefixName}Interface`;

    file.addInterface({
        name: interfaceNameForModel
    }).setIsExported(true);

    file.addImportDeclaration({
        moduleSpecifier: `../validations/${filePrefixName}.validation`,
        defaultImport: `* as ${classPrefixName}Validator`
    });

    const modelClass = file.addClass({
        name: classPrefixName
    });

    modelClass.setExtends(`JsonApiModel<${classPrefixName}>`);
    modelClass.addImplements(interfaceNameForModel);
    modelClass
        .addDecorator({
            name: "JsonApiEntity",
            arguments: [
                `"${pluralize(modelName)}"`,
                (writer) => {
                    writer.block(() => {
                        writer.setIndentationLevel(1);
                        writer.writeLine(
                            `serializer: ${classPrefixName}Serializer,`
                        );
                        writer.writeLine(
                            `repository: ${classPrefixName}Repository,`
                        );
                        writer.writeLine(
                            `validator: ${classPrefixName}Validator`
                        );
                    });
                }
            ]
        })
        .setIsDecoratorFactory(true);
    modelClass.setIsExported(true);

    return file;
}
