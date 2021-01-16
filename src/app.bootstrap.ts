import "reflect-metadata";
import { ApplicationRegistry } from "./core/application/registry.application";
import { container } from "tsyringe";
import { Application } from "./api/application";
import ConfigurationService from "./core/services/configuration.service";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
    const app = await ApplicationRegistry.registerApplication(Application);
    await app.listen(
        container
            .resolve<ConfigurationService>(ConfigurationService)
            .getKey("port") as number
    );
    return app.App;
})();
