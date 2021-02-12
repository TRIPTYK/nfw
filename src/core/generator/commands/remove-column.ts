import { SyntaxKind, VariableDeclarationKind } from "ts-morph";
import { EntityColumn } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function removeColumn(
    modelName: string,
    column: EntityColumn | string
): Promise<void> {
    const model = resources(modelName).find((r) => r.template === "model");
    const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
    const columnName = typeof column === "string" ? column : column.name;
    const { classPrefixName } = getEntityNaming(modelName);

    if (!modelFile) {
        throw new Error("Entity does not exists");
    }

    const entityClass = modelFile.getClass(classPrefixName);

    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }

    const columnProperty = entityClass.getInstanceProperty(columnName);

    if (!columnProperty) {
        throw new Error(`Entity property ${columnProperty} does not exists`);
    }

    const entityInterface = modelFile.getInterface(
        `${classPrefixName}Interface`
    );
    if (entityInterface) {
        entityInterface.getProperty(columnName)?.remove();
    }

    columnProperty.remove();

    const serializer = resources(modelName).find(
        (r) => r.template === "serializer-schema"
    );
    const serializerFile = project.getSourceFile(
        `${serializer.path}/${serializer.name}`
    );
    const serializerClass = serializerFile.getClass(
        `${classPrefixName}SerializerSchema`
    );

    serializerClass.getInstanceProperty(columnName).remove();

    const validation = resources(modelName).find(
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
        );

    for (const validationStatement of validations) {
        const initializer = validationStatement
            .getDeclarations()[0]
            .getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
        if (initializer) {
            const property = initializer.getProperty(columnName);
            if (property) {
                property.remove();
            }
        }
    }
}
