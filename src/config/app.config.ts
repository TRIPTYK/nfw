import * as Express from "express";
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
import UserController from "../api/controllers/user.controller";
import AuthController from "../api/controllers/auth.controller";
import DocumentController from "../api/controllers/document.controller";
import StatusController from "../api/controllers/status.controller";
import { RegisterApplication } from "../core/decorators/application.decorator";
import BaseApplication from "../core/application/base.application";

@RegisterApplication({
    controllers : [
        UserController,
        AuthController,
        DocumentController,
        StatusController
    ],
    providers : []
})
export class Application extends BaseApplication {
    public async setup(): Promise<Express.Application> {
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
}
