/**
 * @module generateEntityFiles
 * @description Generate entity files except model
 * @author Deflorenne Amaury
 * @author Verliefden Romain
 * @author Sam Antoine
 */

// node modules
import project = require("./utils/project");
import resources, { getEntityNaming } from "./static/resources";
import { EntityColumns, Column } from "./interfaces/generator.interface";
import { SourceFile, SyntaxKind, ObjectLiteralExpression, VariableDeclarationKind } from "ts-morph";
import * as stringifyObject from "stringify-object";
import { buildModelColumnArgumentsFromObject } from "./utils/template";

// Check entity existence, and write file or not according to the context
export async function generateJsonApiEntity(modelName: string, data: EntityColumns = null): Promise<void> {

    if (!modelName.length) {
        return;
    }

    const tableColumns = data ?? {
        columns:[],
        relations:[]
    };
    const files: SourceFile[] = [];
    const {filePrefixName,classPrefixName} = getEntityNaming(modelName);

    for (const file of resources(filePrefixName)) {
        const {default : generator} = await import(`./templates/${file.template}`);
        const createdFile = await generator({
            modelName,
            classPrefixName,
            filePrefixName,
            fileTemplateInfo : file,
            tableColumns
        });
        files.push(createdFile);
    }

    const applicationFile = project.getSourceFile("src/api/application.ts");
    const applicationClass = applicationFile.getClasses()[0];
    const importControllerName = `${classPrefixName}Controller`;

    const objectArgs = applicationClass.getDecorator("RegisterApplication").getArguments()[0] as ObjectLiteralExpression;
    const controllersArray = objectArgs.getProperty("controllers").getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const exists = controllersArray.getElements().find((elem) => elem.getText() === importControllerName);

    if (!exists) {
        controllersArray.addElement(importControllerName);
    }

    for (const column of tableColumns.columns) {
        await addColumn(modelName,column);
    }

    // auto generate imports
    for (const file of files.concat(applicationFile)) {
        file.fixMissingImports();
    }

    await project.save();
}

// Check entity existence, and write file or not according to the context
export async function deleteJsonApiEntity(modelName: string): Promise<void> {
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

    await project.save();
}

export async function addColumn(entity: string,column: Column,save = false): Promise<void> {
    const model = resources(entity).find((r) => r.template === "model");
    const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
    const {classPrefixName} = getEntityNaming(entity);

    if (!modelFile) {
        throw new Error("Entity does not exists");
    }

    const entityClass = modelFile.getClass(classPrefixName);

    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }

    if(entityClass.getInstanceProperty(column.name)) {
        throw new Error("Class property already exists");
    }

    entityClass.addProperty({name : column.name })
        .toggleModifier("public")
        .addDecorator({
            name : "Column" , arguments : stringifyObject(
                buildModelColumnArgumentsFromObject(column)
            )
        })
        .setIsDecoratorFactory(true);

    const serializer =  resources(entity).find((r) => r.template === "serializer-schema");
    const serializerFile = project.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${classPrefixName}SerializerSchema`);

    const serializeProperty = serializerClass.addProperty(column);

    serializeProperty.addDecorator({
        name: "Serialize"
    }).setIsDecoratorFactory(true);

    serializeProperty.addDecorator({
        name: "Deserialize"
    }).setIsDecoratorFactory(true);
}

export async function removeColumn(modelName: string,column: Column | string): Promise<void> {
    const model = resources(modelName).find((r) => r.template === "model");
    const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
    const columnName = typeof column === "string" ? column : column.name;
    const {classPrefixName} = getEntityNaming(modelName);

    if (!modelFile) {
        throw new Error("Entity does not exists");
    }

    const entityClass = modelFile.getClass(classPrefixName);

    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }

    const columnProperty = entityClass.getInstanceProperty(columnName);

    if(!columnProperty) {
        throw new Error("Entity property does not exists");
    }

    columnProperty.remove();

    const serializer =  resources(modelName).find((r) => r.template === "serializer-schema");
    const serializerFile = project.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${classPrefixName}SerializerSchema`);

    serializerClass.getInstanceProperty(columnName).remove();

    const validation =  resources(modelName).find((r) => r.template === "validation");
    const validationFile = project.getSourceFile(`${validation.path}/${validation.name}`);

    const validations =  validationFile.getChildrenOfKind(SyntaxKind.VariableStatement)
        .filter((declaration) => declaration.hasExportKeyword() && declaration.getDeclarationKind() === VariableDeclarationKind.Const);

    for (const validationStatement of validations) {
        const initializer = validationStatement.getDeclarations()[0].getInitializer() as ObjectLiteralExpression;
        const property = initializer.getProperty(columnName);
        if (property) {
            property.remove()
        };
    }


    await project.save();
}
