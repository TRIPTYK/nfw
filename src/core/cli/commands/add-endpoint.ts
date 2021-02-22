import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function addEndpoint(
    route: string,
    method: string,
    subroute?: string
): Promise<void> {
    subroute = subroute ?? "/";

    const methodName = `${method.toLowerCase()}`;
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

    const routeClass = controllerFile.getClass(`${classPrefixName}Controller`);

    if (!routeClass) {
        throw new Error("This class does not exit");
    }

    routeClass.addMethod({
        name: methodName,
        parameters: [
            {
                name: "req",
                type: "Express.Request"
            },
            {
                name: "res",
                type: "Express.Response"
            }
        ]
    });

    const classMethod = routeClass.getMethod(methodName);
    classMethod.setBodyText(
        `res.send("${method} of ${route + subroute} works !");`
    );
    classMethod
        .addDecorator({
            name:
                method.charAt(0).toUpperCase() + method.toLowerCase().slice(1),
            arguments: [`"${subroute}"`]
        })
        .setIsDecoratorFactory(true);
    controllerFile.fixMissingImports();
}
