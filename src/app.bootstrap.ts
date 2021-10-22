import "reflect-metadata";
import { TypeORMService } from "@triptyk/nfw-core";
import { ApplicationRegistry, ConfigurationService } from "@triptyk/nfw-core";
import { container } from "tsyringe";
import { Application } from "./api/application";
import { AuthController } from "./api/controllers/auth.controller";
import { DocumentController } from "./api/controllers/document.controller";
import { StatusController } from "./api/controllers/status.controller";
import { ACLMiddleware } from "./api/middlewares/acl.middleware";
import { AuthMiddleware } from "./api/middlewares/auth.middleware";
import { LoggerService } from "./api/services/logger.service";
import { MulterService } from "./api/services/multer.service";
import { UserRepository } from "./api/repositories/user.repository";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
    const app = await ApplicationRegistry.registerApplication(Application, {
        controllers: [
            AuthController,
            // UserController,
            DocumentController,
            StatusController
        ],
        serializers: [],
        services: [
            // MailService,
            
            ConfigurationService,
            TypeORMService,
            MulterService,
            LoggerService,
        ],
        middlewares: [
            ACLMiddleware,
            AuthMiddleware
        ],
        entities: [],
        repositories: [
            UserRepository
        ]
    });
    await app.listen(
        container
            .resolve<ConfigurationService>(ConfigurationService)
            .getKey("port") as number
    );
    return app.App;
})();
