import project = require("../utils/project");
import TsMorph = require("ts-morph");
import stringifyObject = require("stringify-object");
import { buildValidationArgumentsFromObject } from "../utils/template";
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createValidationTemplate({modelName,fileTemplateInfo,classPrefixName,tableColumns,crudOptions,filePrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    file.addStatements((writer) => writer.writeLine("import * as Joi from \"@hapi/joi\";"));
    file.addStatements((writer) => writer.writeLine("import Boom from \"@hapi/boom\";"));
    file.addStatements((writer) => writer.writeLine("import * as Moment from \"moment-timezone\";"));
    file.addStatements((writer) => writer.writeLine("import { ValidationSchema } from \"../../core/types/validation\";"))
    file.addStatements((writer) => writer.writeLine(`import { ${classPrefixName} } from "../models/${filePrefixName}.model";`))

    if (crudOptions.read) {
        let variableStatement = file.addVariableStatement({
            declarationKind: TsMorph.VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `get${classPrefixName}`,
                    type: `ValidationSchema<${classPrefixName}>`,
                    initializer: stringifyObject({
                        id : {
                            in: ["params"],
                            errorMessage: "Please provide a valid id",
                            isInt: true,
                            toInt: true
                        }
                    })
                }
            ]
        });
        variableStatement.setIsExported(true);

        variableStatement = file.addVariableStatement({
            declarationKind: TsMorph.VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `list${classPrefixName}`,
                    type: `ValidationSchema<${classPrefixName}>`,
                    initializer: stringifyObject({

                    })
                }
            ]
        });
        variableStatement.setIsExported(true);

        variableStatement.addJsDoc({
            description : `Get validation for ${modelName}`
        });
    }

    if (crudOptions.create) {
        const objectsToInsert = {};

        for (const entity of tableColumns.columns) {objectsToInsert[entity.name] = buildValidationArgumentsFromObject(entity);}

        const variableStatement = file.addVariableStatement({
            declarationKind: TsMorph.VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `create${classPrefixName}`,
                    type: `ValidationSchema<${classPrefixName}>`,
                    initializer: stringifyObject(objectsToInsert)
                }
            ]
        });
        variableStatement.setIsExported(true);
        variableStatement.addJsDoc({
            description : `Create validation for ${modelName}`
        });
    }

    if (crudOptions.update) {
        let variableStatement = file.addVariableStatement({
            declarationKind: TsMorph.VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `replace${classPrefixName}`,
                    type: `ValidationSchema<${classPrefixName}>`,
                    initializer: (writer) => {
                        writer.block(() => {
                            writer.writeLine(`...exports.get${classPrefixName},`);
                            writer.writeLine(`...exports.create${classPrefixName}`);
                        })
                    }
                }
            ]
        });
        variableStatement.setIsExported(true);
        variableStatement.addJsDoc({
            description : `Replace validation for ${modelName}`
        });

        const objectsToInsert = {};

        for (const entity of tableColumns.columns) {objectsToInsert[entity.name] = buildValidationArgumentsFromObject(entity,true);}

        variableStatement = file.addVariableStatement({
            declarationKind: TsMorph.VariableDeclarationKind.Const,
            declarations: [
                {
                    name: `update${classPrefixName}`,
                    type: `ValidationSchema<${classPrefixName}>`,
                    initializer: (writer) => {
                        writer.block(() => {
                            writer.writeLine(`...exports.get${classPrefixName},`);
                            writer.write(`...${stringifyObject(objectsToInsert)}`)
                        })
                    }
                }
            ]
        });
        variableStatement.setIsExported(true);
        variableStatement.addJsDoc({
            description : `Update validation for ${modelName}`
        });
    }

    file.fixMissingImports();

    return file;
};
