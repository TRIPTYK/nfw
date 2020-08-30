import * as Express from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as Helmet from "helmet";
import * as RateLimit from "express-rate-limit";

import ErrorHandlerMiddleware from "./middlewares/error-handler.middleware";
import { Environments } from "./enums/environments.enum";
import BaseApplication from "../core/application/base.application";
import DocumentController from "./controllers/document.controller";
import UserController from "./controllers/user.controller";
import AuthController from "./controllers/auth.controller";
import { container, autoInjectable } from "tsyringe";
import { PassportService } from "./services/passport.service";
import StatusController from "./controllers/status.controller";
import MetadataController from "../core/controllers/prefab/metadata.controller";
import { RegisterApplication } from "../core/decorators/application.decorator";
import { MailService } from "./services/mail-sender.service";
import TypeORMService from "./services/typeorm.service";
import { MulterService } from "./services/multer.service";
import { LoggerService } from "./services/logger.service";
import GeneratorController from "../core/controllers/prefab/generator.controller";
import ConfigurationService from "../core/services/configuration.service";

@RegisterApplication({
    controllers: [AuthController,UserController,DocumentController,StatusController,MetadataController,GeneratorController],
    services:[MailService,TypeORMService,MulterService,PassportService,LoggerService,ConfigurationService]
})
@autoInjectable()
export class Application extends BaseApplication {
    public constructor(private loggerService: LoggerService,private configurationService: ConfigurationService) {
        super();
    }

    public listen(port: number) {
        return super.listen(port).then(() => {
            this.loggerService.logger.info(`HTTP server is now running on port ${port}`);
        });
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async init() {
        super.init();
        const  { authorized , api , env  } = this.configurationService.config;

        /**
         * Expose body on req.body
         *
         * @inheritdoc https://www.npmjs.com/package/body-parser
         */
        this.app.use(BodyParser.urlencoded({ extended: false }));
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

        this.app.use(`/api/${api.version}`, apiLimiter , this.router );

        /**
         * Request logging with Morgan
         * dev : console | production : file
         *
         * @inheritdoc https://github.com/expressjs/morgan
         */
        if (env !== Environments.Test) {
            this.app.use(Morgan(
                env === Environments.Production ? "production" : "dev"
            ));
        }

        const errorHandlerMiddleware = container.resolve(ErrorHandlerMiddleware);

        if (env === Environments.Production || env === Environments.Test) {
            this.app.use(
                (err, req, res, next) => errorHandlerMiddleware.exit(err, req, res, next) // need to call like this do not loose references
            );
        } else {
            this.app.use(
                (err, req: Express.Request, res: Express.Response, next: Express.NextFunction) => errorHandlerMiddleware.log(err, req, res, next),
                (err, req: Express.Request, res: Express.Response, next: Express.NextFunction) => errorHandlerMiddleware.exit(err, req, res, next)
            );
        }

        this.app.use(
            (req: Express.Request, res: Express.Response, next: Express.NextFunction) => errorHandlerMiddleware.notFound(req, res, next)
        );

        return this.app;
    }
}
