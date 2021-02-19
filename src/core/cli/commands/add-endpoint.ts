import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function addEndpoint(
    route: string,
    method: string
): Promise<void> {
    try {
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

        const routeClass = controllerFile.getClass(
            `${classPrefixName}Controller`
        );

        if (!routeClass) {
            throw new Error("This class does not exit");
        }

        routeClass.addMethod({
            name: methodName,
            parameters: [
                {
                    name: "res",
                    type: "Express.Response"
                },
                {
                    name: "req",
                    type: "Express.Request"
                }
            ]
        });

        const classMethod = routeClass.getMethod(methodName);
        classMethod.setBodyText(`res.send("${method} of ${classPrefixName} works !");`);
        classMethod
            .addDecorator({
                name:
                    method.charAt(0).toUpperCase() +
                    method.toLowerCase().slice(1),
                arguments: [`"/"`]
            })
            .setIsDecoratorFactory(true);
        controllerFile.fixMissingImports();
    } catch (error) {
        console.log(error);
        throw new Error();
    }
}
