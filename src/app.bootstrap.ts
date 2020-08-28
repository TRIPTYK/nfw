import "reflect-metadata";
import {ElasticSearchConfiguration} from "./config/elastic.config";
import EnvironmentConfiguration from "./config/environment.config";
import { LoggerConfiguration } from "./config/logger.config";
import { ApplicationRegistry } from "./core/application/registry.application";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
    const env = EnvironmentConfiguration.guessCurrentEnvironment();

    const configuration = EnvironmentConfiguration.loadEnvironment(env);
    LoggerConfiguration.setup();

    LoggerConfiguration.logger.info(`Starting in ${env} environment`);

    /**
     * ELASTIC support , might change in future releases
     */
    if (configuration.elastic.enabled) {
        try {
            const connection = ElasticSearchConfiguration.connect();
            await connection.ping();
            LoggerConfiguration.logger.info(`Connection to ElasticSearch server established on url ${configuration.elastic.url}`);
        } catch (e) {
            LoggerConfiguration.logger.error(`Failed to establish connection to ElasticSearch server on url ${configuration.elastic.url}`);
            process.exit(1);
        }
    }

    const {Application} = await import("./config/app.config");

    const app = await ApplicationRegistry.registerApplication(Application);

    await app.listen(configuration.port);

    LoggerConfiguration.logger.info(`HTTP server is now running on port ${configuration.port}`);

    return app.App;
})();

