import { ArrowFunction, Project, PropertyAccessExpression, SyntaxKind } from "ts-morph";
import resources, { getEntityNaming } from "../static/resources";

export async function removeRelation(entity: string,relationName: string) {
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

    if(!entityClass.getInstanceProperty(relationName)) {
        throw new Error("Relation property does not exists");
    }

    
    const property = entityClass.getProperty(relationName);
    const relationDecorator = property.getDecorators().find((dec) => ["ManyToOne","ManyToMany","OneToMany","OneToOne"].includes(dec.getName()));
    const callExpression = relationDecorator.getCallExpression();
    const [,inverseArg] = callExpression.getArguments();
    const arrowFnc = inverseArg as ArrowFunction;
    const perpertyAccess = arrowFnc.getBody() as PropertyAccessExpression;
}