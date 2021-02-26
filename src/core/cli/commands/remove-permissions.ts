import { ArrayLiteralExpression, PropertyAccessExpression } from "ts-morph";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function removePerms(
    route: string,
    role: string
): Promise<void> {
    const controller = resources(route).find(
        (r) => r.template === "controller"
    );

    const controllerFile = project.getSourceFile(
        `${controller.path}/${controller.name}`
    );

    const { classPrefixName } = getEntityNaming(route);

    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }

    const controllerClass = controllerFile.getClass(
        `${classPrefixName}Controller`
    );

    if (!controllerClass) {
        throw new Error("This class does not exit");
    }

    const decorators = controllerClass.getDecorator("RouteMiddleware");

    const args = decorators.getArguments()[1] as ArrayLiteralExpression;
    for (const e of args.getElements()) {
        const tmp = e as PropertyAccessExpression;
        if (tmp.getName() === role) {
            args.removeElement(e);
        }
    }

    if (decorators.getArguments()[1].getText() === "[]") {
        decorators.remove();
    }
}
