import project = require("../utils/project");
import stringifyObject = require("stringify-object");
import { SourceFile } from "ts-morph";
import { buildModelColumnArgumentsFromObject } from "../utils/template";
import { GeneratorParameters } from "../interfaces/generator.interface";

/**
 *
 * @param path
 * @param className
 * @param {array} entities
 * @return {SourceFile}
 */
export default function createModelTemplate({fileTemplateInfo,tableColumns,classPrefixName}: GeneratorParameters): SourceFile {

    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    const modelClass = file.addClass({
        name: classPrefixName
    });

    modelClass.setExtends("BaseModel");
    modelClass.addDecorator({name : "Entity"}).setIsDecoratorFactory(true);
    modelClass.setIsExported(true);

    const propId = modelClass.addProperty({
        name: "id: number"
    });
    propId.toggleModifier("public");

    propId.addDecorator({
        name: "PrimaryGeneratedColumn",
        arguments: []
    }).setIsDecoratorFactory(true);

    tableColumns.columns.forEach((entity) => {
        const prop = modelClass.addProperty({
            name : entity.name
        }).toggleModifier("public");

        prop.addDecorator({
            name : "Column" ,
            arguments : stringifyObject(buildModelColumnArgumentsFromObject(entity)) as any
        }).setIsDecoratorFactory(true);
    });

    file.fixMissingImports();

    return file;
};
