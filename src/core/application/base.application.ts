import * as Express from "express";
import ApplicationInterface from "../interfaces/application.interface";
import { ApplicationRegistry } from "./registry.application";
import { Type } from "../types/global";
import { RouteDefinition } from "../decorators/controller.decorator";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { container } from "tsyringe";

export default abstract class BaseApplication implements ApplicationInterface{
    protected app: Express.Application;
    protected router: Express.Router;

    public constructor() {
        this.app = Express();
        this.router = Express.Router();
    }

    public init() {
        this.setupControllers();
    }

    public get App() {
        return this.app;
    }

    public listen(port: number) {
        return new Promise((resolve) => {
            this.app.listen(port, (server) => {
                resolve(server);
            });
        })
    }

    protected setupControllers() {
        const controllers: Type<any>[] = Reflect.getMetadata("controllers",this)
        for (const controller of controllers) {
            const instanceController = new controller();

            // The prefix saved to our controller
            const prefix = Reflect.getMetadata("routeName", controller);
            // Our `routes` array containing all our routes for this controller
            const routes: RouteDefinition[] = Reflect.getMetadata("routes", controller);

            const middlewaresForController: { middleware: any ; args: object }[] = Reflect.getMetadata("middlewares", controller);
            const router = Express.Router();

            if (middlewaresForController && middlewaresForController.length > 0) {
                middlewaresForController.reverse();
                router.use(middlewaresForController.map((e) => {
                    const realMiddleware: BaseMiddleware = container.resolve(e.middleware);

                    return (req, res, next) => {
                        try {
                            return realMiddleware.use(req, res, next, e.args);
                        } catch (error) {
                            return next(error);
                        }
                    };
                }));
            }

            this.router.use(`/${prefix}`, router);

            const controllerMiddleware = (methodName) => async (req: Express.Request, res: Express.Response, next) => {
                try {
                    const response = await instanceController[methodName](req, res);
                    if (!res.headersSent) {
                        res.send(response);
                    }
                } catch (e) {
                    return next(e);
                }
            };

            if (Reflect.getMetadata("entity",instanceController)) {
                router.get("/:id/:relation", controllerMiddleware("fetchRelated"));
                router.get("/:id/relationships/:relation", controllerMiddleware("fetchRelationsships"));
                router.post("/:id/relationships/:relation", controllerMiddleware("addRelationships"));
                router.patch("/:id/relationships/:relation", controllerMiddleware("updateRelationships"));
                router.delete("/:id/:relation", controllerMiddleware("removeRelationships"));
            }

            // Iterate over all routes and register them to our express application
            for (const route of routes) {
                let middlewaresWithArgs =
                    Reflect.getMetadata("middlewares", controller , route.methodName) as { middleware: any ; args: object }[];

                if (!middlewaresWithArgs) {
                    middlewaresWithArgs = [];
                }

                middlewaresWithArgs.reverse();

                const middlewares = [];

                for (const iterator of middlewaresWithArgs) {
                    const realMiddleware: BaseMiddleware = container.resolve(iterator.middleware);

                    // need to arrow function to keep "this" context in method
                    middlewares.push((req, res, next) => {
                        try {
                            return realMiddleware.use(req, res, next, iterator.args);
                        } catch (e) {
                            return next(e);
                        }
                    });
                }

                middlewares.push(controllerMiddleware(route.methodName));

                router[route.requestMethod](`${route.path}`, middlewares);
            }
        }
    }
}
