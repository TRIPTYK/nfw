import project = require("../utils/project");
import TsMorph = require("ts-morph");
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createRelationsTemplate({fileTemplateInfo,tableColumns,modelName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });


    const array = file.addVariableStatement({
        declarationKind: TsMorph.VariableDeclarationKind.Const,
        declarations : [
            {
                name: `${modelName}Relations`,
                type : "string[]",
                initializer : `[${tableColumns.relations.map((column) => `'${column.name}'`)}]`
            }
        ]
    });

    array.addJsDoc((writer) => {
        writer.writeLine("@description allowed JSON-API includes relations");
    });

    array.setIsExported(true);

    return file;
};
