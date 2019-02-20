"use strict";
exports.__esModule = true;
var Express = require("express");
var BodyParser = require("body-parser");
var Morgan = require("morgan");
var Cors = require("cors");
var Compression = require("compression");
var Passport = require("passport");
var ExpressValidator = require("express-validator");
var ServiceErrorHandler = require("../api/services/error-handler.service");
var Helmet = require("helmet");
var RateLimit = require("express-rate-limit");
var passport_config_1 = require("./passport.config");
var environment_config_1 = require("./environment.config");
var v1_1 = require("./../api/routes/v1");
/**
 * Instanciate Express application
 */
var app = Express();
exports.app = app;
/**
 * Expose body on req.body
 *
 * @inheritdoc https://www.npmjs.com/package/body-parser
 */
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json({ type: 'application/vnd.api+json' }));
/**
 * GZIP compression
 *
 * @inheritdoc https://github.com/expressjs/compression
 */
app.use(Compression());
/**
 * Public resources
 */
app.use(Express.static('public'));
/**
 * Enable and set Helmet security middleware
 *
 * @inheritdoc https://github.com/helmetjs/helmet
 */
app.use(Helmet());
/**
 * Enable CORS - Cross Origin Resource Sharing
 *
 * @inheritdoc https://www.npmjs.com/package/cors
 */
var CORSOptions = {
    origin: environment_config_1.authorized,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(Cors(CORSOptions));
/**
 * Passport configuration
 *
 * @inheritdoc http://www.passportjs.org/
 */
app.use(Passport.initialize());
Passport.use('jwt', passport_config_1.strategies.jwt);
Passport.use('facebook', passport_config_1.strategies.facebook);
Passport.use('google', passport_config_1.strategies.google);
/**
 * Set validation engine
 */
app.use(ExpressValidator());
/**
 * Configure API Rate limit
 * Note that you can also set limit on specific route path
 *
 * @inheritdoc https://www.npmjs.com/package/express-rate-limit
 */
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
var apiLimiter = RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after an hour"
});
/**
 * Set RateLimit and Router(s) on paths
 */
app.use("/api/" + environment_config_1.api, apiLimiter, v1_1.router);
/**
 * Request logging with Morgan
 * dev : console | production : file
 *
 * @inheritdoc https://github.com/expressjs/morgan
 */
if (environment_config_1.env.toUpperCase() !== environment_config_1.environments.TEST) {
    app.use(Morgan(environment_config_1.HTTPLogs));
}
/**
 * Errors handlers
 */
if (environment_config_1.env.toUpperCase() === environment_config_1.environments.DEVELOPMENT || environment_config_1.env.toUpperCase() === environment_config_1.environments.TEST) {
    app.use(ServiceErrorHandler.exit);
}
else {
    app.use(ServiceErrorHandler.log, ServiceErrorHandler.exit);
}
app.use(ServiceErrorHandler.notFound);
