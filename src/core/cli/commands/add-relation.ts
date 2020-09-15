import { Relation } from "../interfaces/generator.interface";
import resources, { getEntityNaming } from "../static/resources";
import * as pluralize from "pluralize";

export default async function addRelation(entity:string,relation: Relation) {
    const project = require("../utils/project");
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

            const inverseRelationProperty =  inverseEntityClass.addProperty({name : relation.name })
                .toggleModifier("public");

            inverseRelationProperty.addDecorator({
                name : "ManyToMany", 
                arguments : [`() => ${naming.classPrefixName}`,`(inverseRelation) => inverseRelation.${relation.name}`]
            });
            break;
        }
        case "one-to-many": {
            break;
        }
        case "one-to-one": {
            break;
        }
    }
}