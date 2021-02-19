import { ObjectLiteralExpression, SyntaxKind } from "ts-morph";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function deleteRoute(routeName: string): Promise<void> {
    if (!routeName.length) {
        return;
    }

    const { filePrefixName, classPrefixName } = getEntityNaming(routeName);

    const file = resources(filePrefixName).find(
        (f) => f.template === "base-controller"
    );

    const fileObj = project.getSourceFile(`${file.path}/${file.name}`);
    if (!fileObj) {
        throw new Error(`Entity file ${file.name} does not seems to exists`);
    }

    // do something

    fileObj?.delete();

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

    controllersArray.removeElement(exists);

    applicationFile.fixUnusedIdentifiers();
}
