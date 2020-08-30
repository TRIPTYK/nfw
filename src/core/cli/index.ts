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
import { SourceFile, SyntaxKind } from "ts-morph";
import * as stringifyObject from "stringify-object";

// Check entity existence, and write file or not according to the context
export async function generateJsonApiEntity(modelName: string, data: EntityColumns = null): Promise<void> {

    if (!modelName.length) {
        return;
    }

    const tableColumns = data ?? {
        columns:[],
        relations:[]
    };
    const files = [];
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

    // auto generate imports
    for (const file of files) {
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
    const {filePrefixName} = getEntityNaming(modelName);

    for (const file of resources(filePrefixName)) {
        files.push(project.getSourceFile(`${file.path}/${file.name}`));
    }

    // do something

    for (const file of files) {
        file.delete();
    }

    await project.save();
}

export async function addColumn(entity: string,column: Column): Promise<void> {
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
            name : "Column" , arguments : stringifyObject({
                length: column.length,
                type: column.type
            })
        })
        .setIsDecoratorFactory(true)

    modelFile.fixMissingImports();

    const serializer =  resources(entity).find((r) => r.template === "serializer-schema");
    const serializerFile = project.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${classPrefixName}SerializerSchema`);

    const serializeProperty = serializerClass.getStaticProperty("serialize").getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const derializeProperty = serializerClass.getStaticProperty("deserialize").getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);

    if (!serializeProperty.getElements().find((element) => element.getText() === column.name)) {
        serializeProperty.addElement(`"${column.name}"`);
    }

    if (!derializeProperty.getElements().find((element) => element.getText() === column.name)) {
        serializeProperty.addElement(`"${column.name}"`);
    }

    await project.save();
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

    const arraySerialize = serializerClass.getStaticProperty("serialize").getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
    const arrayDeserialize =  serializerClass.getStaticProperty("deserialize").getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);

    for (const elem of arraySerialize.getElements()) {
        if (elem.getText() === columnName) {
            arraySerialize.removeElement(elem);
        }
    }

    for (const elem of arrayDeserialize.getElements()) {
        if (elem.getText() === columnName) {
            arrayDeserialize.removeElement(elem);
        }
    }

    await project.save();
}
