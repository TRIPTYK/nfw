import * as Express from "express";
import {Request, Response} from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as Helmet from "helmet";
import * as RateLimit from "express-rate-limit";

import { PassportConfig } from "./passport.config";
import ErrorHandlerMiddleware from "../api/middlewares/error-handler.middleware";
import EnvironmentConfiguration from "./environment.config";
import { Environments } from "../api/enums/environments.enum";
import { RouteDefinition } from "../api/decorators/controller.decorator";
import { fstat, readdirSync } from "fs";
import { join } from "path";
import { container } from "tsyringe";
import { IMiddleware, BaseMiddleware } from "../api/middlewares/base.middleware";

export class Application {
    private readonly app: Express.Application;

    get App() {
        return this.app;
    }

    constructor() {
        this.app = Express();
    }

    public async init() {
        return this.setup();
    }

    private async setup(): Promise<Express.Application> {
        const { config : { authorized , api , env ,  } } = EnvironmentConfiguration;

        /**
         * Expose body on req.body
         *
         * @inheritdoc https://www.npmjs.com/package/body-parser
         */
        this.app.use(BodyParser.urlencoded({extended: false}));
        this.app.use(BodyParser.json({type: "application/vnd.api+json"}));

        /**
         * GZIP compression
         *
         * @inheritdoc https://github.com/expressjs/compression
         */
        this.app.use(Compression());

        /**
         * Public resources
         */
        this.app.use("/static", Express.static("dist/uploads/documents"));

        /**
         * Enable and set Helmet security middleware
         *
         * @inheritdoc https://github.com/helmetjs/helmet
         */
        this.app.use(Helmet());

        /**
         * Enable CORS - Cross Origin Resource Sharing
         *
         * @inheritdoc https://www.npmjs.com/package/cors
         */
        const CORSOptions = {
            allowedHeaders: ["Content-Type", "Authorization"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            origin: authorized
        };
        this.app.use(Cors(CORSOptions));

        /**
         * Passport configuration
         *
         * @inheritdoc http://www.passportjs.org/
         */
        this.app.use(Passport.initialize());

        this.app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

        const apiLimiter = new RateLimit({
            max: 1000,
            message: "Too many requests from this IP, please try again after an hour",
            windowMs: 60 * 60 * 1000
        });

        const mainRouter = await this.registerRoutes();

        this.app.use(`/api/${api}`, apiLimiter , mainRouter );

        const passportConfig = new PassportConfig();
        passportConfig.init(this.app);

        /**
         * Request logging with Morgan
         * dev : console | production : file
         *
         * @inheritdoc https://github.com/expressjs/morgan
         */
        if (env !== Environments.Test) {
            this.app.use(Morgan(
                env === Environments.Production ?
                "production" : "dev"
            ));
        }

        if (env === Environments.Production || env === Environments.Test) {
            this.app.use(
                (err, req, res, next) => ErrorHandlerMiddleware.exit(err, req, res, next) // need to call like this do not loose references
            );
        } else {
            this.app.use(
                (err, req, res, next) => ErrorHandlerMiddleware.log(err, req, res, next),
                (err, req, res, next) => ErrorHandlerMiddleware.exit(err, req, res, next)
            );
        }

        this.app.use(
            (req, res, next) => ErrorHandlerMiddleware.notFound(req, res, next)
        );

        return this.app;
    }

    private async registerRoutes() {
        // Iterate over all our controllers and register our routes
        const controllers = await Promise.all(
            readdirSync(join(process.cwd(), "src/api/controllers/"))
                .filter((e) => e.includes("base.controller") === false)
                .map((e) => import("./../api/controllers/" + e))
        );

        const mainRouter = Express.Router();
        for (const controller of controllers) {
            // This is our instantiated class
            const instance = new controller.default();

            // The prefix saved to our controller
            const prefix = Reflect.getMetadata("routeName", controller.default);
            // Our `routes` array containing all our routes for this controller
            const routes: RouteDefinition[] = Reflect.getMetadata("routes", controller.default);

            const middlewaresForController: { middleware: any , args: object }[] = Reflect.getMetadata("middlewares", controller.default);
            const router = Express.Router();

            if (middlewaresForController && middlewaresForController.length > 0) {
                router.use(middlewaresForController.map((e) => {
                    const realMiddleware: BaseMiddleware = container.resolve(e.middleware);

                    return (req, res, next) => realMiddleware.use(req, res, next, e.args);
                }));
            }

            mainRouter.use(`/${prefix}`, router);

            // Iterate over all routes and register them to our express application
            for (const route of routes) {
                let middlewaresWithArgs =
                    Reflect.getMetadata("middlewares", controller.default , route.methodName) as { middleware: any , args: object }[];

                if (!middlewaresWithArgs) {
                    middlewaresWithArgs = [];
                }

                const middlewares = [];

                const controllerMiddleware = async (req: Request, res: Response, next) => {
                    try {
                        const response = await instance[route.methodName](req, res);
                        res.send(response);
                    } catch (e) {
                        return next(e);
                    }
                };

                for (const iterator of middlewaresWithArgs) {
                    const realMiddleware: BaseMiddleware = container.resolve(iterator.middleware);

                    // need to arrow function to keep "this" context in method
                    middlewares.push((req, res, next) => realMiddleware.use(req, res, next, iterator.args));
                }

                middlewares.push(controllerMiddleware);

                router[route.requestMethod](`${route.path}`, middlewares);
            }
        }

        return mainRouter;
    }
}
