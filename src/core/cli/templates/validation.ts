import project = require("../utils/project");
import TsMorph = require("ts-morph");
import stringifyObject = require("stringify-object");
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createValidationTemplate({fileTemplateInfo,classPrefixName,filePrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    file.addStatements((writer) => writer.writeLine("import * as Joi from \"@hapi/joi\";"));
    file.addStatements((writer) => writer.writeLine("import Boom from \"@hapi/boom\";"));
    file.addStatements((writer) => writer.writeLine("import * as Moment from \"moment-timezone\";"));
    file.addStatements((writer) => writer.writeLine("import { ValidationSchema } from \"../../core/types/validation\";"))
    file.addStatements((writer) => writer.writeLine(`import { ${classPrefixName} } from "../models/${filePrefixName}.model";`))

    let variableStatement = file.addVariableStatement({
        declarationKind: TsMorph.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "get",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: stringifyObject({
                    id : {
                        in: ["params"],
                        errorMessage: "Please provide a valid id",
                        isInt: true,
                        toInt: true
                    }
                },{ singleQuotes: false })
            }
        ]
    });
    variableStatement.setIsExported(true);

    variableStatement = file.addVariableStatement({
        declarationKind: TsMorph.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "list",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: "{}"
            }
        ]
    });
    variableStatement.setIsExported(true);



    variableStatement = file.addVariableStatement({
        declarationKind: TsMorph.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "create",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: "{}"
            }
        ]
    });
    variableStatement.setIsExported(true);

    variableStatement = file.addVariableStatement({
        declarationKind: TsMorph.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "update",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: (writer) => {
                    writer.block(() => {
                        writer.writeLine("...exports.get,");
                        writer.write("...{}")
                    })
                }
            }
        ]
    });
    variableStatement.setIsExported(true);

    variableStatement = file.addVariableStatement({
        declarationKind: TsMorph.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "remove",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: "{}"
            }
        ]
    });
    variableStatement.setIsExported(true);

    return file;
}

