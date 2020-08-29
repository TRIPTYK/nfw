import project = require("../utils/project");
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createSerializer({modelName,fileTemplateInfo,classPrefixName,filePrefixName}: GeneratorParameters) {

    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    file.addStatements((writer) => writer.writeLine(`import { ${classPrefixName} } from "../models/${filePrefixName}.model";`));


    const serializerClass = file.addClass({
        name: `${classPrefixName}Serializer`
    });

    serializerClass.setIsExported(true);
    serializerClass.setExtends(`BaseSerializer<${classPrefixName}>`);

    serializerClass.addDecorator({
        name: "injectable",
        arguments: []
    });

    serializerClass.addConstructor({
        parameters : [{ name : "serializerParams: SerializerParams" , initializer : "{}"}],
        statements : [
            `super(${classPrefixName}SerializerSchema.schema)`,
            `if(serializerParams.pagination) {
                this.setupPaginationLinks(serializerParams.pagination);
            }`
        ]
    })
        .toggleModifier("public")
        .addJsDoc(`${modelName} constructor`)

    return file;
};
