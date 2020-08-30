import project = require("../utils/project");
import { GeneratorParameters } from "../interfaces/generator.interface";

/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
export default function createControllerTemplate({fileTemplateInfo,classPrefixName,filePrefixName}: GeneratorParameters) {
    const file = project.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true
    });


    file.addImportDeclaration({
        namedImports: [classPrefixName],
        moduleSpecifier: `../models/${filePrefixName}.model`,
    })

    const controllerClass = file.addClass({
        name: `${classPrefixName}Controller`
    });

    controllerClass.setIsDefaultExport(true);

    controllerClass.addDecorator({
        name: "JsonApiController",
        arguments: [`${classPrefixName}`]
    }).setIsDecoratorFactory(true);
    controllerClass.addDecorator({
        name: "singleton"
    }).setIsDecoratorFactory(true);
    controllerClass.addDecorator({
        name: "autoInjectable"
    }).setIsDecoratorFactory(true);

    controllerClass.setExtends(`BaseJsonApiController<${classPrefixName}>`);

    return file;
};
