import "reflect-metadata";
import { TypeORMService } from "@triptyk/nfw-core";
import { ApplicationRegistry, ConfigurationService } from "@triptyk/nfw-core";
import { container } from "tsyringe";
import { Application } from "./api/application";
import { AuthController } from "./api/controllers/auth.controller";
import { StatusController } from "./api/controllers/status.controller";
import { LoggerService } from "./api/services/logger.service";
import { MulterService } from "./api/services/multer.service";
import { UserRepository } from "./api/repositories/user.repository";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
    const app = await ApplicationRegistry.registerApplication(Application, {
        baseRoute: "/api/v1",
        controllers: [
            AuthController,
            // UserController,
            // DocumentController,
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
