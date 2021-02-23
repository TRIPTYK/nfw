import { ObjectLiteralExpression, SyntaxKind } from "ts-morph";
import { ApplicationRegistry } from "../../application/registry.application";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";
import addEndpoint from "./add-endpoint";

export default async function generateBasicRoute(
    prefix: string,
    methods?: Array<string>
): Promise<void> {
    if (!prefix) return;

    for (const route of ApplicationRegistry.application.Routes) {
        if (prefix === route.prefix)
            throw new Error("This route already exists.");
    }

    methods = methods ?? ["GET"];

    const { filePrefixName, classPrefixName } = getEntityNaming(prefix);

    const file = resources(filePrefixName).find(
        (f) => f.template === "base-controller"
    );
    const { default: generator } = await import(
        `../templates/${file.template}`
    );
    const createdFile = await generator({
        prefix,
        classPrefixName,
        filePrefixName,
        fileTemplateInfo: file
    });

    const applicationFile = project.getSourceFile("src/api/application.ts");
    const applicationClass = applicationFile.getClasses()[0];
    const importControllerName = `${classPrefixName}Controller`;

    const objectArgs = applicationClass
        .getDecorator("RegisterApplication")
        .getArguments()[0] as ObjectLiteralExpression;
    const controllersArray = objectArgs
        .getProperty("controllers")
        .getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const exists = controllersArray
        .getElements()
        .find((elem) => elem.getText() === importControllerName);

    if (!exists) {
        controllersArray.addElement(importControllerName);
    }

    for (const method of methods) {
        await addEndpoint(prefix, method);
    }

    // auto generate imports
    for (const file of [].concat(applicationFile, createdFile)) {
        file.fixMissingImports();
    }
}
