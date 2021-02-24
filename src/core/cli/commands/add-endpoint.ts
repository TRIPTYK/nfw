import { normalize } from "path";
import { getConnection } from "typeorm";
import { ApplicationRegistry } from "../../application";
import { toCamelCase } from "../../utils/case.util";
import resources, { getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function addEndpoint(
    prefix: string,
    method: string,
    subroute?: string
): Promise<void> {
    if (
        ApplicationRegistry.application.Routes.find((r) => r.prefix === prefix)
            ?.type === "basic"
    ) {
        throw new Error("Subroute can't be added to basic routes.");
    }

    subroute = `/${normalize(subroute ?? "/").replace(/^\/+|\/+$/, "")}`;

    prefix = getJsonApiEntityName(prefix)?.entityName.toLowerCase() ?? prefix;

    const methodName = toCamelCase(
        `${method} ${prefix} ${subroute.replace("/", " ")}`
    );
    const controller = resources(prefix).find(
        (r) => r.template === "controller"
    );

    const controllerFile = project.getSourceFile(
        `${controller.path}/${controller.name}`
    );

    const { classPrefixName } = getEntityNaming(prefix);

    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }

    if (!controllerFile.getImportDeclaration("express")) {
        controllerFile.addImportDeclaration({
            defaultImport: "Express",
            moduleSpecifier: "express"
        });
    }

    const routeClass = controllerFile.getClass(`${classPrefixName}Controller`);

    if (!routeClass) {
        throw new Error("This class does not exit.");
    }

    if (routeClass.getMethod(methodName)) {
        throw new Error("This method already exists.");
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
        // eslint-disable-next-line no-template-curly-in-string
        "res.send(`${req.method} works on ${req.baseUrl + req.url} !!!`);"
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

function getJsonApiEntityName(prefix: string) {
    return getConnection()
        .entityMetadatas.filter((table) =>
            ApplicationRegistry.entities.includes(table.target as any)
        )
        .map((table) => {
            return {
                entityName: table.name,
                tableName: table.tableName
            };
        })
        .find((table) => table.tableName.toLowerCase() === prefix);
}
