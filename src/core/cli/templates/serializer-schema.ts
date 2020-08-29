import project = require ("../utils/project");
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createSerializerSchema({modelName,fileTemplateInfo,classPrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    const addedClass = file.addClass({
        name : `${classPrefixName}SerializerSchema`,
        isDefaultExport : true
    });

    addedClass.addProperty({
        isStatic : true,
        type : "string",
        name : "type",
        initializer : `"${modelName}"`
    })
        .toggleModifier("public");

    addedClass.addProperty({
        isStatic : true,
        type : "string[]",
        name : "serialize",
        initializer : "[]"
    })
        .toggleModifier("public");

    addedClass.addProperty({
        isStatic : true,
        type : "string[]",
        name : "deserialize",
        initializer : "[]"
    })
        .toggleModifier("public");

    addedClass.addGetAccessor({
        isStatic : true,
        returnType : "Readonly<JSONAPISerializerSchema>",
        name : "schema"
    }).setBodyText(`
return {
    relationships : {},
    type: ${classPrefixName}SerializerSchema.type,
    whitelist: ${classPrefixName}SerializerSchema.serialize,
    whitelistOnDeserialize : ${classPrefixName}SerializerSchema.deserialize
};
    `)
        .toggleModifier("public");

    return file;
}
