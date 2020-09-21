import { Relation } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import * as pluralize from "pluralize";
import { Project } from "ts-morph";
import * as pascalcase from "pascalcase";

export default async function addRelation(entity: string,relation: Relation) {
    const project: Project = require("../utils/project");
    const model = resources(entity).find((r) => r.template === "model");
    const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
    const naming = getEntityNaming(entity);

    if (!modelFile) {
        throw new Error("Entity does not exists");
    }

    const entityClass = modelFile.getClass(naming.classPrefixName);

    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }

    if(entityClass.getInstanceProperty(relation.name)) {
        throw new Error("Relation property already exists");
    }

    const inverseModel = resources(relation.target).find((r) => r.template === "model");
    const inversemodelFile = project.getSourceFile(`${inverseModel.path}/${inverseModel.name}`);

    if (!inversemodelFile) {
        throw new Error("Entity does not exists");
    }

    const inverseNaming = getEntityNaming(relation.target);
    const inverseEntityClass = inversemodelFile.getClass(inverseNaming.classPrefixName);

    if (!inverseEntityClass) {
        throw new Error("Entity class does not exists");
    }

    modelFile.addImportDeclaration({
        namedImports : [inverseNaming.classPrefixName],
        moduleSpecifier : `../models/${inverseNaming.filePrefixName}.model`
    });
    inversemodelFile.addImportDeclaration({
        namedImports : [naming.classPrefixName],
        moduleSpecifier : `../models/${naming.filePrefixName}.model`
    });

    const existing = entityClass.getProperty(relation.name);

    if (existing) {
        existing.remove();
    }

    const mainRelationProperty =  entityClass.addProperty({name : relation.name })
        .toggleModifier("public");

    relation.inverseRelationName ??= relation.type === "many-to-many" ? pluralize(relation.target) : relation.target;
    const decoratorName = pascalcase(relation.type);
    const inverseDecoratorName = relation.type === "one-to-many" ? decoratorName : "ManyToOne";

    const entityInterface = modelFile.getInterface(`${naming.classPrefixName}Interface`);
    if (entityInterface) {
        entityInterface.addProperty({name : relation.name });
    }

    const inverseEntityInterface = inversemodelFile.getInterface(`${inverseNaming.classPrefixName}Interface`);
    if (inverseEntityInterface) {
        inverseEntityInterface.addProperty({name : relation.inverseRelationName });
    }

    mainRelationProperty
        .addDecorator({
            name : decoratorName,
            arguments : [`() => ${inverseNaming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.inverseRelationName}`]
        })
        .setIsDecoratorFactory(true);

    const existingInverse = inverseEntityClass.getProperty(relation.inverseRelationName);

    if (existingInverse) {
        existingInverse.remove();
    }

    const inverseRelationProperty =  inverseEntityClass
        .addProperty({name : relation.inverseRelationName })
        .toggleModifier("public");

    inverseRelationProperty
        .addDecorator({
            name : inverseDecoratorName,
            arguments : [`() => ${naming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.name}`]
        })
        .setIsDecoratorFactory(true);

    inversemodelFile.fixMissingImports();
    modelFile.fixMissingImports();
    inversemodelFile.organizeImports();
    modelFile.organizeImports();

    const serializer =  resources(entity).find((r) => r.template === "serializer-schema");
    const serializerFile = project.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${naming.classPrefixName}SerializerSchema`);

    const serializerPropertyExists = serializerClass.getProperty(relation.name);

    if (serializerPropertyExists) {
        serializerPropertyExists.remove();
    }

    const serializerProperty = serializerClass
        .addProperty({name: relation.name})
        .toggleModifier("public");

    serializerProperty.addDecorator({
        name : "Relation",
        arguments: [`() => ${inverseNaming.classPrefixName}SerializerSchema`]
    });

    const inverseSerializer =  resources(relation.target).find((r) => r.template === "serializer-schema");
    const inverseSerializerFile = project.getSourceFile(`${inverseSerializer.path}/${inverseSerializer.name}`);
    const inverseSerializerClass = inverseSerializerFile.getClass(`${inverseNaming.classPrefixName}SerializerSchema`);

    const inverseSerializerPropertyExists = inverseSerializerClass.getProperty(relation.name);

    if (inverseSerializerPropertyExists) {
        inverseSerializerPropertyExists.remove();
    }

    const inverseSerializerProperty = inverseSerializerClass
        .addProperty({name: relation.inverseRelationName})
        .toggleModifier("public");

    inverseSerializerProperty.addDecorator({
        name : "Relation",
        arguments: [`() => ${naming.classPrefixName}SerializerSchema`]
    });

    inverseSerializerFile.fixMissingImports();
    serializerFile.fixMissingImports();
}
