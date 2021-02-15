import {
    BaseApplication,
    ConfigurationService,
    ErrorMiddleware,
    GeneratorController,
    GlobalMiddleware,
    MetadataController,
    NotFoundMiddleware,
    RegisterApplication,
    TypeORMService
} from "@triptyk/nfw-core";
import * as BodyParser from "body-parser";
import * as Compression from "compression";
import * as Cors from "cors";
import * as Express from "express";
import * as Helmet from "helmet";
import * as Passport from "passport";
import { autoInjectable } from "tsyringe";
import { AuthController } from "./controllers/auth.controller";
import { DocumentController } from "./controllers/document.controller";
import { StatusController } from "./controllers/status.controller";
import { UserController } from "./controllers/user.controller";
import { RateLimitMiddleware } from "./middlewares/rate-limit.middleware";
import { LoggerService } from "./services/logger.service";
import { MailService } from "./services/mail-sender.service";
import { MulterService } from "./services/multer.service";
import { PassportService } from "./services/passport.service";

@RegisterApplication({
    controllers: [
        AuthController,
        UserController,
        DocumentController,
        StatusController,
        MetadataController,
        GeneratorController
    ],
    services: [
        MailService,
        TypeORMService,
        MulterService,
        PassportService,
        LoggerService,
        ConfigurationService
    ]
})
@GlobalMiddleware(RateLimitMiddleware)
@GlobalMiddleware(NotFoundMiddleware, null, "after")
@GlobalMiddleware(ErrorMiddleware, null, "after")
@autoInjectable()
export class Application extends BaseApplication {
    public async afterInit(): Promise<any> {
        return true;
    }

    public constructor(
        private loggerService: LoggerService,
        private configurationService: ConfigurationService
    ) {
        super();
    }

    public listen(port: number) {
        return super.listen(port).then(() => {
            this.loggerService.logger.info(
                `HTTP server is now running on port ${port}`
            );
        });
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async init() {
        super.init();
        const { authorized, api } = this.configurationService.config;

        /**
         * Expose body on req.body
         *
         * @inheritdoc https://www.npmjs.com/package/body-parser
         */
        this.app.use(BodyParser.urlencoded({ extended: false }));
        this.app.use(BodyParser.json({ type: "application/vnd.api+json" }));

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

        this.app.use(`/api/${api.version}`, this.router);

        return this.app;
    }
}
