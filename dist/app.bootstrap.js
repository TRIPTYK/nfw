"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = require("./config/logger.config");
var environment_config_1 = require("./config/environment.config");
var App = require("./config/app.config");
/** Listen to requests */
App.listen(environment_config_1.port, function () { return Logger.info("HTTP server is now running on port " + environment_config_1.port + " (" + environment_config_1.env + ")"); });
/**
 * Exports Express
 */
module.exports = App;
