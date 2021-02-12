import { ObjectLiteralExpression, SourceFile, SyntaxKind } from "ts-morph";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function deleteJsonApiEntity(
    modelName: string
): Promise<void> {
    if (!modelName.length) {
        return;
    }

    const files: SourceFile[] = [];
    const { filePrefixName, classPrefixName } = getEntityNaming(modelName);

    for (const file of resources(filePrefixName)) {
        const fileObj = project.getSourceFile(`${file.path}/${file.name}`);
        if (!fileObj) {
            throw new Error(
                `Entity file ${file.name} does not seems to exists`
            );
        }
        files.push(fileObj);
    }

    // do something

    for (const file of files) {
        file?.delete();
    }

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
