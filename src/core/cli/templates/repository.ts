import project = require("../utils/project");
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createRepositoryTemplate({fileTemplateInfo,classPrefixName,filePrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    file.addStatements((writer) => writer.writeLine("import Boom from '@hapi/boom';"));
    file.addStatements((writer) => writer.writeLine(`import { ${classPrefixName} } from "../models/${filePrefixName}.model";`));

    const repoClass = file.addClass({
        name: `${classPrefixName}Repository`
    });

    repoClass.setIsExported(true);
    repoClass.setExtends(`BaseRepository<${classPrefixName}>`);

    repoClass.addDecorator({
        name : "EntityRepository",
        arguments : `${classPrefixName}` as any
    }).setIsDecoratorFactory(true);

    repoClass.addConstructor({
        statements : "super();"
    })
        .toggleModifier("public");

    return file;
};
