import * as Fs from "fs";
import * as HTTPS from "https";
import {TypeORMConfiguration} from "./config/typeorm.config";

import {logger as Logger} from "../src/config/logger.config" ; 
import {env, environments, https, port, typeorm} from "./config/environment.config";

module.exports = (async () => {
    /** Connection to Database server before app configuration */
    await TypeORMConfiguration.connect()
        .catch( (error) => {
            if(env !== environments['TEST'].toLowerCase())
                Logger.error(`MySQL connection error : ${error.message}`);
            process.exit(1);
        });

    if(env !== environments['TEST'].toLowerCase())
        Logger.info(`Connection to ${typeorm.type} server established on port ${typeorm.port} (${env})`);

    const {app} = await import("./config/app.config");

    /**
     * HTTPS configuration
     */
    if(https.isActive === 1)
    {
        let credentials = {
            key: Fs.readFileSync(https.key, "utf8"),
            cert: Fs.readFileSync(https.cert, "utf8"),
            ca: [Fs.readFileSync(https.ca, "utf8")],
        };

        HTTPS
            .createServer(credentials, app)
            .listen(port, function () {
                if (env !== environments['TEST'].toLowerCase())
                    Logger.info(`HTTPS server is now running on port ${port} (${env})`)
            });
    }
    else
    {
        app.listen( port, () => {
            if(env !== environments['TEST'].toLowerCase())
                Logger.info(`HTTP server is now running on port ${port} (${env})`)
        });
    }

    return app;
})();

