"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Express = require("express");
var BodyParser = require("body-parser");
var Morgan = require("morgan");
var Cors = require("cors");
var Compression = require("compression");
var Passport = require("passport");
var ErrorHandler = require("errorhandler");
var ExpressValidator = require("express-validator");
var ServiceErrorHandler = require("../api/services/error-handler.service");
var Strategies = require("./passport.config");
var environment_config_1 = require("./environment.config");
var Router = require('./../api/routes/v1');
/**
 * Instanciate Express application
 */
var app = Express();
/**
 * GZIP compression
 */
app.use(Compression());
/**
 * Public resources
 */
app.use(Express.static('public'));
/**
 * Expose body on req.body
 */
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
/**
 * Enable CORS - Cross Origin Resource Sharing
 */
app.use(Cors());
/**
 * Passport configuration
 */
app.use(Passport.initialize());
Passport.use('jwt', Strategies.jwt);
Passport.use('facebook', Strategies.facebook);
Passport.use('google', Strategies.google);
/**
 * Set validation engine
 */
app.use(ExpressValidator());
/**
 * Set Router(s) on paths
 */
app.use("/api/" + environment_config_1.api, Router);
/**
 * Request logging with Morgan
 * dev : console | production : file
 */
app.use(Morgan(environment_config_1.HTTPLogs));
/**
 * Errors handlers
 */
if (environment_config_1.env.toUpperCase() === environment_config_1.environments.DEVELOPMENT) {
    app.use(ErrorHandler({ log: ServiceErrorHandler.notify }));
}
else {
    app.use(ErrorHandler({ log: ServiceErrorHandler.log }));
}
/**
 * Exports Express
 */
module.exports = app;
