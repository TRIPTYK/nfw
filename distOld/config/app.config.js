"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const BodyParser = require("body-parser");
const Morgan = require("morgan");
const Cors = require("cors");
const Compression = require("compression");
const Passport = require("passport");
const ExpressValidator = require("express-validator");
const ServiceErrorHandler = require("../api/services/error-handler.service");
const Helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const Boom = require("boom");
const passport_config_1 = require("./passport.config");
const environment_config_1 = require("./environment.config");
const jsonapi_serializer_1 = require("jsonapi-serializer");
const v1_1 = require("./../api/routes/v1");
const auth_middleware_1 = require("../api/middlewares/auth.middleware");
/**
 * Instanciate Express application
 */
let app = Express();
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
let CORSOptions = {
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
const apiLimiter = RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again after an hour"
});
/**
 * Set RateLimit and Router(s) on paths
 */
app.use(`/api/${environment_config_1.api}`, apiLimiter, v1_1.router);
/**
 * get routes of API , needed AFTER the other routes were set
 */
const allRoutes = require('express-list-endpoints')(v1_1.router);
const serializer = new jsonapi_serializer_1.Serializer("apiroutes", { attributes: ["methods", "path"] });
for (let i = 0; i < allRoutes.length; i++)
    allRoutes[i]['id'] = i + 1;
const allRoutesSerialized = serializer.serialize(allRoutes);
app.get(`/api/${environment_config_1.api}/apiroutes`, auth_middleware_1.authorize([auth_middleware_1.ADMIN]), (req, res) => {
    res.json(allRoutesSerialized);
});
app.get(`/api/${environment_config_1.api}/apiroutes/:id`, auth_middleware_1.authorize([auth_middleware_1.ADMIN]), (req, res) => {
    const route = allRoutes.find(e => e.id == req.params.id);
    if (route === undefined)
        throw Boom.notFound();
    res.json(serializer.serialize(route));
});
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
