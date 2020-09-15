import { SyntaxKind, VariableDeclarationKind } from "ts-morph";
import { ObjectLiteralExpression } from "ts-morph";
import { Column } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import { buildModelColumnArgumentsFromObject, buildValidationArgumentsFromObject } from "../utils/template";
import * as stringifyObject from "stringify-object";

export default async function addColumn(entity: string,column: Column,save = false): Promise<void> {
    const project = require("../utils/project");
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

    const serializeProperty = serializerClass.addProperty({
        name: column.name
    });

    serializeProperty.addDecorator({
        name: "Serialize"
    }).setIsDecoratorFactory(true);

    serializeProperty.addDecorator({
        name: "Deserialize"
    }).setIsDecoratorFactory(true);

    const validation =  resources(entity).find((r) => r.template === "validation");
    const validationFile = project.getSourceFile(`${validation.path}/${validation.name}`);

    const validations =  validationFile.getChildrenOfKind(SyntaxKind.VariableStatement)
        .filter((declaration) => declaration.hasExportKeyword() && declaration.getDeclarationKind() === VariableDeclarationKind.Const)
        .filter((declaration) => ["create","update"].includes(declaration.getDeclarations()[0].getName()));

    

    for (const validationStatement of validations) {
        const initializer = validationStatement.getDeclarations()[0].getInitializer() as ObjectLiteralExpression;
        initializer.addPropertyAssignment({
            name: column.name,
            initializer: stringifyObject(buildValidationArgumentsFromObject(column))
        });
    }
}