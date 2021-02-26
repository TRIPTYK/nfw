import { ArrayLiteralExpression, PropertyAccessExpression } from "ts-morph";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function getPerms(entity: any): Promise<any> {
    const controller = resources(entity).find(
        (r) => r.template === "controller"
    );

    const controllerFile = project.getSourceFile(
        `${controller.path}/${controller.name}`
    );
    const { classPrefixName } = getEntityNaming(entity);

    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }

    const controllerClass = controllerFile.getClass(
        `${classPrefixName}Controller`
    );

    if (!controllerClass) {
        throw new Error("This class does not exit");
    }

    const array = [];
    const decorators = controllerClass.getDecorator("RouteMiddleware");
    if (decorators) {
        const args = decorators.getArguments()[1] as ArrayLiteralExpression;
        args.getElements().forEach((e) => {
            const tmp = e as PropertyAccessExpression;

            array.push(tmp.getName());
        });
    }

    return array;
}
