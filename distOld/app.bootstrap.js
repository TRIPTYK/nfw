"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const HTTPS = require("https");
const logger_config_1 = require("./config/logger.config");
const environment_config_1 = require("./config/environment.config");
const typeorm_config_1 = require("./config/typeorm.config");
/** Connection to Database server before app configuration */
typeorm_config_1.TypeORMConfiguration
    .connect()
    .then((connection) => {
    if (environment_config_1.env !== environment_config_1.environments.TEST.toLowerCase())
        logger_config_1.logger.info(`Connection to ${environment_config_1.typeorm.type} server established on port ${environment_config_1.typeorm.port} (${environment_config_1.env})`);
})
    .catch((error) => {
    if (environment_config_1.env !== environment_config_1.environments.TEST.toLowerCase())
        logger_config_1.logger.error(`MySQL connection error : ${error.message}`);
});
const app_config_1 = require("./config/app.config");
exports.App = app_config_1.app;
let server = undefined;
/**
 * HTTPS configuration
 */
if (environment_config_1.https.isActive === 1) {
    let credentials = {
        key: Fs.readFileSync(environment_config_1.https.key, "utf8"),
        cert: Fs.readFileSync(environment_config_1.https.cert, "utf8")
    };
    HTTPS
        .createServer(credentials, app_config_1.app)
        .listen(environment_config_1.port, function () {
        if (environment_config_1.env !== environment_config_1.environments.TEST.toLowerCase())
            logger_config_1.logger.info(`HTTP server is now running on port ${environment_config_1.port} (${environment_config_1.env})`);
    });
}
else {
    server = app_config_1.app.listen(environment_config_1.port, () => {
        if (environment_config_1.env !== environment_config_1.environments.TEST.toLowerCase())
            logger_config_1.logger.info(`HTTP server is now running on port ${environment_config_1.port} (${environment_config_1.env})`);
    });
}
