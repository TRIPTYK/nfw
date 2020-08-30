import project = require("../utils/project");
import { GeneratorParameters } from "../interfaces/generator.interface";

export default function createRepositoryTemplate({fileTemplateInfo,classPrefixName,filePrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`,null,{
        overwrite : true
    });

    file.addImportDeclaration({
        namedImports : [classPrefixName],
        moduleSpecifier : `../models/${filePrefixName}.model`
    });

    const repoClass = file.addClass({
        name: `${classPrefixName}Repository`
    });

    repoClass.setIsExported(true);
    repoClass.setExtends(`BaseJsonApiRepository<${classPrefixName}>`);

    repoClass.addConstructor({
        statements : "super();"
    }).toggleModifier("public");

    return file;
};
