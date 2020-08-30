import project = require("../utils/project");
import stringifyObject = require("stringify-object");
import { SourceFile } from "ts-morph";
import { buildModelColumnArgumentsFromObject } from "../utils/template";
import { GeneratorParameters } from "../interfaces/generator.interface";
import  * as pluralize from "pluralize";

/**
 *
 * @param path
 * @param className
 * @param {array} entities
 * @return {SourceFile}
 */
export default function createModelTemplate({fileTemplateInfo,tableColumns,classPrefixName,modelName,filePrefixName}: GeneratorParameters): SourceFile {

    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    const interfaceNameForModel = `${classPrefixName}Interface`;

    file.addInterface({
        name : interfaceNameForModel
    }).setIsExported(true);

    file.addImportDeclaration({
        moduleSpecifier : `../validations/${filePrefixName}.validation`,
        defaultImport: `* as ${classPrefixName}Validator`
    })

    const modelClass = file.addClass({
        name: classPrefixName
    });

    modelClass.setExtends(`JsonApiModel<${classPrefixName}>`);
    modelClass.addImplements(interfaceNameForModel);
    modelClass.addDecorator({name : "JsonApiEntity",arguments : [`"${pluralize(modelName)}"`,(writer) => {
        writer.block(() => {
            writer.setIndentationLevel(1);
            writer.writeLine(`serializer: ${classPrefixName}Serializer,`);
            writer.writeLine(`repository: ${classPrefixName}Repository,`);
            writer.writeLine(`validator: ${classPrefixName}Validator`);
        });
    }
    ]}).setIsDecoratorFactory(true);
    modelClass.setIsExported(true);

    tableColumns.columns.forEach((entity) => {
        const prop = modelClass.addProperty({
            name : entity.name
        }).toggleModifier("public");

        prop.addDecorator({
            name : "Column" ,
            arguments : stringifyObject(buildModelColumnArgumentsFromObject(entity)) as any
        }).setIsDecoratorFactory(true);
    });

    return file;
};
