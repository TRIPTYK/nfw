import * as Fs from "fs";
import * as HTTPS from "https";
import {TypeORMConfiguration} from "./config/typeorm.config";
import {ElasticSearchConfiguration} from "./config/elastic.config";

import {logger as Logger} from "../src/config/logger.config" ;
import {env, environments , https, port, typeorm , elastic_enable , elastic_url} from "./config/environment.config";

module.exports = (async () => {
    /** Connection to Database server before app configuration */
    await TypeORMConfiguration.connect()
        .catch( (error) => {
            if (env !== environments["TEST"].toLowerCase()) {
                Logger.error(`${typeorm.type} connection error : ${error.message}`);
            }
            process.exit(1);
        });

    if (env !== environments["TEST"].toLowerCase()) {
        Logger.info(`Connection to ${typeorm.type} server established on port ${typeorm.port} (${env})`);
    }

    /**
     * ELASTIC support , might change in future releases
     */
    if (elastic_enable) {
        try {
            const connection = await ElasticSearchConfiguration.connect();
            await connection.ping();
            Logger.info(`Connection to ElasticSearch server established on url ${elastic_url} (${env})`);
        } catch (e) {
            Logger.error(`Failed to establish connection to ElasticSearch server on url ${elastic_url} (${env})`);
            process.exit(1);
        }
    }


    const { Application } = await import("./config/app.config");
    const SetupApp = new Application();

    /**
     * HTTPS configuration
     */
    if (https.isActive === 1) {
        const credentials = {
            ca: [Fs.readFileSync(https.ca, "utf8")],
            cert: Fs.readFileSync(https.cert, "utf8"),
            key: Fs.readFileSync(https.key, "utf8")
        };

        HTTPS
            .createServer(credentials, SetupApp.App)
            .listen(port, () => {
                if (env !== environments["TEST"].toLowerCase()) {
                    Logger.info(`HTTPS server is now running on port ${port} (${env})`);
                }
            });
    } else {
        SetupApp.App.listen( port, () => {
            if (env !== environments["TEST"].toLowerCase()) {
                Logger.info(`HTTP server is now running on port ${port} (${env})`);
            }
        });
    }

    return SetupApp.App;
})();

