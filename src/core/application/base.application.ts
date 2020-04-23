import * as Express from "express";
import { RouteDefinition } from "../decorators/controller.decorator";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { container } from "tsyringe";

export default abstract class BaseApplication {
    protected readonly app: Express.Application;
    protected controllers = [];

    public constructor(controllers) {
        this.app = Express();
        this.controllers = controllers;
    }

    public init(): void {
        this.setup();
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    protected async registerRoutes(): Promise<Express.Router> {
        const mainRouter = Express.Router();
        for (const controller of this.controllers) {
            // This is our instantiated class
            const instance = new controller();

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

            mainRouter.use(`/${prefix}`, router);

            // Iterate over all routes and register them to our express application
            for (const route of routes) {
                let middlewaresWithArgs =
                    Reflect.getMetadata("middlewares", controller , route.methodName) as { middleware: any ; args: object }[];

                if (!middlewaresWithArgs) {
                    middlewaresWithArgs = [];
                }

                middlewaresWithArgs.reverse();

                const middlewares = [];

                const controllerMiddleware = async (req: Express.Request, res: Express.Response, next) => {
                    try {
                        const response = await instance[route.methodName](req, res);
                        if (!res.headersSent) {
                            res.send(response);
                        }
                    } catch (e) {
                        return next(e);
                    }
                };

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

                middlewares.push(controllerMiddleware);

                router[route.requestMethod](`${route.path}`, middlewares);
            }
        }

        return mainRouter;
    }

    protected abstract setup();

    public get App(): Express.Application {
        return this.app;
    }
}
