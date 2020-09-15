import { Relation } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import * as pluralize from "pluralize";
import { Project } from "ts-morph";

export default async function addRelation(entity:string,relation: Relation) {
    const project : Project = require("../utils/project");
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

    const mainRelationProperty =  entityClass.addProperty({name : relation.name })
        .toggleModifier("public");

    switch(relation.type) {
        case "many-to-many": {
            relation.inverseRelationName ??= pluralize(relation.target);
            mainRelationProperty .addDecorator({
                name : "ManyToMany", 
                arguments : [`() => ${inverseNaming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.inverseRelationName}`]
            })
            .setIsDecoratorFactory(true);

            const inverseRelationProperty =  inverseEntityClass.addProperty({name : relation.inverseRelationName })
                .toggleModifier("public");

            inverseRelationProperty.addDecorator({
                name : "ManyToMany", 
                arguments : [`() => ${naming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.name}`]
            });
            break;
        }
        case "one-to-many": {
            relation.inverseRelationName ??= relation.target;
            mainRelationProperty.addDecorator({
                name : "OneToMany", 
                arguments : [`() => ${inverseNaming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.inverseRelationName}`]
            })
            .setIsDecoratorFactory(true);

            const inverseRelationProperty =  inverseEntityClass.addProperty({name : relation.inverseRelationName })
                .toggleModifier("public");

            inverseRelationProperty.addDecorator({
                name : "ManyToOne", 
                arguments : [`() => ${naming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.name}`]
            });
            break;
        }
        case "one-to-one": {
            relation.inverseRelationName ??= relation.target;
            mainRelationProperty.addDecorator({
                name : "OneToOne", 
                arguments : [`() => ${inverseNaming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.inverseRelationName}`]
            })
            .setIsDecoratorFactory(true);

            mainRelationProperty.addDecorator({name:"JoinColumn"}).setIsDecoratorFactory(true);

            const inverseRelationProperty =  inverseEntityClass.addProperty({name : relation.inverseRelationName })
                .toggleModifier("public");

            inverseRelationProperty.addDecorator({
                name : "OneToOne", 
                arguments : [`() => ${naming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.name}`]
            });
            break;
        }
    }

    inversemodelFile.fixMissingImports();
    modelFile.fixMissingImports();

    const serializer =  resources(entity).find((r) => r.template === "serializer-schema");
    const serializerFile = project.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${naming.classPrefixName}SerializerSchema`);

    const serializerProperty = serializerClass.addProperty({name: relation.name})
        .toggleModifier("public");
    serializerProperty.addDecorator({
        name : "Relation",
        arguments: [`() => ${inverseNaming.classPrefixName}SerializerSchema`]
    });

    const inverseSerializer =  resources(relation.target).find((r) => r.template === "serializer-schema");
    const inverseSerializerFile = project.getSourceFile(`${inverseSerializer.path}/${inverseSerializer.name}`);
    const inverseSerializerClass = inverseSerializerFile.getClass(`${inverseNaming.classPrefixName}SerializerSchema`);

    const inverseSerializerProperty = inverseSerializerClass.addProperty({name: relation.name})
        .toggleModifier("public");
    inverseSerializerProperty.addDecorator({
        name : "Relation",
        arguments: [`() => ${naming.classPrefixName}SerializerSchema`]
    });

    inverseSerializerFile.fixMissingImports();
    serializerFile.fixMissingImports();


}