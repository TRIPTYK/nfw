import "reflect-metadata";
import EnvironmentConfiguration from "./config/environment.config";
import { ApplicationRegistry } from "./core/application/registry.application";
import { container } from "tsyringe";
import { LoggerService } from "./api/services/logger.service";
import { Application } from "./api/application";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
    const env = EnvironmentConfiguration.guessCurrentEnvironment();
    const configuration = EnvironmentConfiguration.loadEnvironment(env);
    const app = await ApplicationRegistry.registerApplication(Application);
    await app.listen(configuration.port);
    container.resolve(LoggerService).logger.info(`HTTP server is now running on port ${configuration.port}`);
    return app.App;
})();

