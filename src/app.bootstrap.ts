import "reflect-metadata";
import * as Fs from "fs";
import * as HTTPS from "https";
import {TypeORMConfiguration} from "./config/typeorm.config";
import {ElasticSearchConfiguration} from "./config/elastic.config";
import yargs = require("yargs");
import EnvironmentConfiguration from "./config/environment.config";
import { LoggerConfiguration } from "./config/logger.config";
import { Environments } from "./api/enums/environments.enum";
import ApplicationFactory from "./core/factory/application.factory";
import { Application } from "./config/app.config";

module.exports = (async () => {
    let {argv : { env }} = yargs.options({
        env: { type: "string" }
    });

    if (env === undefined) {
        env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
    }

    const configuration = EnvironmentConfiguration.loadEnvironment(env);
    LoggerConfiguration.setup();

    LoggerConfiguration.logger.info(`Starting in ${env} environment`);

    /** Connection to Database server before app configuration */
    await TypeORMConfiguration.connect()
        .catch( (error) => {
            LoggerConfiguration.logger.error(`${configuration.typeorm.type} connection error : ${error.message}`);
            process.exit(1);
        });

    if (env !== Environments.Test) {
        LoggerConfiguration.logger.info(`Connection to ${configuration.typeorm.type} server established on port ${configuration.typeorm.port}`);
    }

    /**
     * ELASTIC support , might change in future releases
     */
    if (configuration.elastic.enabled) {
        try {
            const connection = await ElasticSearchConfiguration.connect();
            await connection.ping();
            LoggerConfiguration.logger.info(`Connection to ElasticSearch server established on url ${configuration.elastic.url}`);
        } catch (e) {
            LoggerConfiguration.logger.error(`Failed to establish connection to ElasticSearch server on url ${configuration.elastic.url}`);
            process.exit(1);
        }
    }

    const SetupApp = ApplicationFactory.create(Application);
    await SetupApp.init();

    /**
     * HTTPS configuration
     */
    if (configuration.https.isActive) {
        const credentials = {
            ca: [Fs.readFileSync(configuration.https.ca, "utf8")],
            cert: Fs.readFileSync(configuration.https.cert, "utf8"),
            key: Fs.readFileSync(configuration.https.key, "utf8")
        };

        HTTPS
            .createServer(credentials, SetupApp.App)
            .listen(configuration.port, () => {
                if (env !== Environments.Test) {
                    LoggerConfiguration.logger.info(`HTTPS server is now running on port ${configuration.port}`);
                }
            });
    } else {
        SetupApp.App.listen( configuration.port, () => {
            if (env !== Environments.Test) {
                LoggerConfiguration.logger.info(`HTTP server is now running on port ${configuration.port}`);
            }
        });
    }

    return SetupApp.App;
})();

