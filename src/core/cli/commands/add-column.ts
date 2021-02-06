import * as stringifyObject from "stringify-object";
import {
    ObjectLiteralExpression,
    SyntaxKind,
    VariableDeclarationKind
} from "ts-morph";
import { EntityColumn } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";
import {
    buildModelColumnArgumentsFromObject,
    buildValidationArgumentsFromObject
} from "../utils/template";

export default async function addColumn(
    entity: string,
    column: EntityColumn
): Promise<void> {
    const model = resources(entity).find((r) => r.template === "model");
    const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
    const { classPrefixName } = getEntityNaming(entity);

    if (!modelFile) {
        throw new Error("Entity does not exists");
    }

    const entityClass = modelFile.getClass(classPrefixName);

    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }

    if (entityClass.getInstanceProperty(column.name)) {
        throw new Error("Class property already exists");
    }

    const entityInterface = modelFile.getInterface(
        `${classPrefixName}Interface`
    );
    if (entityInterface) {
        entityInterface.addProperty({ name: column.name });
    }

    entityClass
        .addProperty({ name: column.name })
        .toggleModifier("public")
        .addDecorator({
            name: "Column",
            arguments: stringifyObject(
                buildModelColumnArgumentsFromObject(column),
                { singleQuotes: false }
            )
        })
        .setIsDecoratorFactory(true);

    const serializer = resources(entity).find(
        (r) => r.template === "serializer-schema"
    );
    const serializerFile = project.getSourceFile(
        `${serializer.path}/${serializer.name}`
    );
    const serializerClass = serializerFile.getClass(
        `${classPrefixName}SerializerSchema`
    );

    const serializeProperty = serializerClass
        .addProperty({
            name: column.name
        })
        .toggleModifier("public");

    serializeProperty
        .addDecorator({
            name: "Serialize"
        })
        .setIsDecoratorFactory(true);

    serializeProperty
        .addDecorator({
            name: "Deserialize"
        })
        .setIsDecoratorFactory(true);

    const validation = resources(entity).find(
        (r) => r.template === "validation"
    );
    const validationFile = project.getSourceFile(
        `${validation.path}/${validation.name}`
    );

    const validations = validationFile
        .getChildrenOfKind(SyntaxKind.VariableStatement)
        .filter(
            (declaration) =>
                declaration.hasExportKeyword() &&
                declaration.getDeclarationKind() ===
                    VariableDeclarationKind.Const
        )
        .filter((declaration) =>
            ["create", "update"].includes(
                declaration.getDeclarations()[0].getName()
            )
        );

    for (const validationStatement of validations) {
        const initializer = validationStatement
            .getDeclarations()[0]
            .getInitializer() as ObjectLiteralExpression;
        initializer.addPropertyAssignment({
            name: column.name,
            initializer: stringifyObject(
                buildValidationArgumentsFromObject(column),
                { singleQuotes: false }
            )
        });
    }

    modelFile.fixMissingImports();
}
