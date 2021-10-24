import "reflect-metadata";
import { ApplicationRegistry, ConfigurationService } from "@triptyk/nfw-core";
import { container } from "tsyringe";
import { AuthController } from "./api/controllers/auth.controller";
import { StatusController } from "./api/controllers/status.controller";

module.exports = (async () => {
    const app = await ApplicationRegistry.registerApplication({
        baseRoute: "/api/v1",
        controllers: [
            AuthController,
            StatusController
        ]
    });
    app.listen(
        container
            .resolve<ConfigurationService>(ConfigurationService)
            .getKey("port") as number
    );
    return app;
})();
