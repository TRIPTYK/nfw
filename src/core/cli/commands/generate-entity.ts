import { ObjectLiteralExpression, SourceFile, SyntaxKind } from "ts-morph";
import { EntityColumns } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";
import addColumn from "./add-column";
import addRelation from "./add-relation";

export default async function generateJsonApiEntity(
    modelName: string,
    data?: EntityColumns
): Promise<void> {
    if (!modelName.length) {
        return;
    }

    const tableColumns = data ?? {
        columns: [],
        relations: []
    };

    const files: SourceFile[] = [];
    const { filePrefixName, classPrefixName } = getEntityNaming(modelName);

    for (const file of resources(filePrefixName)) {
        const { default: generator } = await import(
            `../templates/${file.template}`
        );
        const createdFile = await generator({
            modelName,
            classPrefixName,
            filePrefixName,
            fileTemplateInfo: file,
            tableColumns
        });
        files.push(createdFile);
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

    if (!exists) {
        controllersArray.addElement(importControllerName);
    }

    for (const column of tableColumns.columns) {
        await addColumn(modelName, column);
    }

    for (const relation of tableColumns.relations) {
        await addRelation(modelName, relation);
    }

    // auto generate imports
    for (const file of files.concat(applicationFile)) {
        file.fixMissingImports();
    }
}
