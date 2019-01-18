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
var ServiceErrorHandler = require("./../api/services/error-handler");
var Strategies = require("./passport.config");
var Router = require('./../api/routes/v1');
var _a = require('./environment.config'), HTTPLogs = _a.HTTPLogs, api = _a.api, env = _a.env, environments = _a.environments;
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
app.use("/api/" + api, Router);
/**
 * Request logging with Morgan
 * dev : console | production : file
 */
app.use(Morgan(HTTPLogs));
/**
 * Errors handlers
 */
if (env.toUpperCase() === environments.DEVELOPMENT) {
    app.use(ErrorHandler({ log: ServiceErrorHandler.notify }));
}
else {
    app.use(ErrorHandler({ log: ServiceErrorHandler.log }));
}
/**
 * Exports Express
 */
module.exports = app;
//# sourceMappingURL=app.config.js.map