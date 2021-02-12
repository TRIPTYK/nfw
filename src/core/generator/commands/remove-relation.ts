import { ArrowFunction, PropertyAccessExpression, SyntaxKind } from "ts-morph";
import { EntityRelation } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export async function removeRelation(
    entity: string,
    relationName: string | EntityRelation
) {
    const model = resources(entity).find((r) => r.template === "model");
    const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
    const naming = getEntityNaming(entity);
    relationName =
        typeof relationName === "string" ? relationName : relationName.name;

    if (!modelFile) {
        throw new Error("Entity does not exists");
    }

    const entityClass = modelFile.getClass(naming.classPrefixName);

    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }

    if (!entityClass.getProperty(relationName)) {
        throw new Error("Relation property does not exists");
    }

    const property = entityClass.getProperty(relationName);
    const relationDecorator = property
        .getDecorators()
        .find((dec) =>
            ["ManyToOne", "ManyToMany", "OneToMany", "OneToOne"].includes(
                dec.getName()
            )
        );
    const callExpression = relationDecorator.getCallExpression();
    const [inverseModel, inverseProp] = callExpression.getArguments() as [
        ArrowFunction,
        ArrowFunction
    ];
    const propertyAccess = inverseProp.getBody() as PropertyAccessExpression;
    const inverseModelIdentifier = inverseModel.getFirstChildByKind(
        SyntaxKind.Identifier
    );
    const inverseDefinitionFile = inverseModelIdentifier
        .getDefinitions()[0]
        .getSourceFile();
    const inverseProperty = propertyAccess
        .getLastChildByKind(SyntaxKind.Identifier)
        .getText();
    const inverseClass = inverseDefinitionFile.getClass(
        inverseModelIdentifier.getText()
    );

    const modelInterface = modelFile.getInterface(
        `${naming.classPrefixName}Interface`
    );
    const inverseInterface = inverseDefinitionFile.getInterface(
        `${inverseModelIdentifier.getText()}Interface`
    );

    const serializer = resources(entity).find(
        (r) => r.template === "serializer-schema"
    );
    const serializerFile = project.getSourceFile(
        `${serializer.path}/${serializer.name}`
    );
    const serializerClass = serializerFile.getClass(
        `${naming.classPrefixName}SerializerSchema`
    );

    const inverseSerializer = resources(
        inverseClass.getName().toLowerCase()
    ).find((r) => r.template === "serializer-schema");
    const inverseSerializerFile = project.getSourceFile(
        `${inverseSerializer.path}/${inverseSerializer.name}`
    );
    const inverseSerializerClass = inverseSerializerFile.getClass(
        `${inverseClass.getName()}SerializerSchema`
    );

    property.remove();
    inverseClass.getProperty(inverseProperty)?.remove();

    modelInterface.getProperty(relationName)?.remove();
    inverseInterface.getProperty(inverseProperty)?.remove();

    serializerClass.getProperty(relationName)?.remove();
    inverseSerializerClass.getProperty(inverseProperty)?.remove();
}
