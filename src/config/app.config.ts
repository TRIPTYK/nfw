import * as Express from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as Helmet from "helmet";
import * as RateLimit from "express-rate-limit";

import IndexRouter from "./../api/routes/v1";
import {api, authorized, env, environments, HTTPLogs} from "./environment.config";
import { PassportConfig } from "./passport.config";
import {ServiceContainer} from "../api/services/service-container.service";
import { MulterService } from "../api/services/multer.service";
import ErrorHandlerMiddleware from "../api/middlewares/error-handler.middleware";


export class Application {
    private readonly app: Express.Application;

    get App() {
        return this.app;
    }

    constructor() {
        this.app = Express();
        this.setup();
    }

    private setup(): Express.Application {
        ServiceContainer.registerService("upload", new MulterService());


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

        const router = new IndexRouter();
        this.app.use(`/api/${api}`, apiLimiter , router.setup());

        const passportConfig = new PassportConfig();
        passportConfig.init(this.app);

        /**
         * Request logging with Morgan
         * dev : console | production : file
         *
         * @inheritdoc https://github.com/expressjs/morgan
         */
        if (env.toUpperCase() !== environments["TEST"]) {
            this.app.use(Morgan(HTTPLogs));
        }

        /**
         * Errors handlers
         */
        const errorHandler = new ErrorHandlerMiddleware();

        if (env.toUpperCase() === environments["DEVELOPMENT"] || env.toUpperCase() === environments["TEST"]) {
            this.app.use(
                (err, req, res, next) => errorHandler.exit(err, req, res, next) // need to call like this do not loose references
            );
        } else {
            this.app.use(
                (err, req, res, next) => errorHandler.log(err, req, res, next),
                (err, req, res, next) => errorHandler.exit(err, req, res, next)
            );
        }

        this.app.use(
            (req, res, next) => errorHandler.notFound(req, res, next)
        );

        return this.app;
    }
}
