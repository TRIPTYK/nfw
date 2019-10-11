import * as Express from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as Helmet from "helmet";
import * as RateLimit from "express-rate-limit";

import {strategies as Strategies} from "./passport.config";
import {router as ProxyRouter} from "./../api/routes/v1";
import * as ErrorHandler from "../api/services/error-handler.service";
import {api, authorized, env, environments, HTTPLogs} from "./environment.config";

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
            origin: authorized,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        };
        this.app.use(Cors(CORSOptions));

        /**
         * Passport configuration
         *
         * @inheritdoc http://www.passportjs.org/
         */
        this.app.use(Passport.initialize());

        Passport.use("jwt", Strategies.jwt);
        Passport.use("facebook", Strategies.facebook);
        Passport.use("google", Strategies.google);

        this.app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

        const apiLimiter = new RateLimit({
            windowMs: 60 * 60 * 1000,
            max: 1000,
            message: "Too many requests from this IP, please try again after an hour"
        });

        /**
         * Set RateLimit and Router(s) on paths
         */
        this.app.use(`/api/${api}`, apiLimiter, ProxyRouter);

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
        if (env.toUpperCase() === environments["DEVELOPMENT"] || env.toUpperCase() === environments["TEST"]) {
            this.app.use(ErrorHandler.exit);
        } else {
            this.app.use(ErrorHandler.log, ErrorHandler.exit);
        }

        this.app.use( ErrorHandler.notFound );

        return this.app;
    }
}
