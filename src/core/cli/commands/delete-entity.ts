import { Project, SyntaxKind } from "ts-morph";
import { SourceFile, ObjectLiteralExpression } from "ts-morph";
import resources, { getEntityNaming } from "../static/resources";

export default async function deleteJsonApiEntity(modelName: string): Promise<void> {
    const project: Project = require("../utils/project");

    if (!modelName.length) {
        return;
    }

    const files: SourceFile[] = [];
    const {filePrefixName,classPrefixName} = getEntityNaming(modelName);

    for (const file of resources(filePrefixName)) {
        files.push(project.getSourceFile(`${file.path}/${file.name}`));
    }

    // do something

    for (const file of files) {
        file.delete();
    }

    const applicationFile = project.getSourceFile("src/api/application.ts");

    const applicationClass = applicationFile.getClasses()[0];
    const importControllerName = `${classPrefixName}Controller`;

    const objectArgs = applicationClass.getDecorator("RegisterApplication").getArguments()[0] as ObjectLiteralExpression;
    const controllersArray = objectArgs.getProperty("controllers").getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const exists = controllersArray.getElements().find((elem) => elem.getText() === importControllerName);

    controllersArray.removeElement(exists);

    applicationFile.fixUnusedIdentifiers();
}