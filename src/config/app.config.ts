import * as Express from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as ExpressValidator from "express-validator";
import * as ServiceErrorHandler from "../api/services/error-handler.service";
import * as Helmet from "helmet";
import * as RateLimit from "express-rate-limit";

import { strategies as Strategies } from "./passport.config";
import { HTTPLogs, authorized, api, env, environments } from "./environment.config";

import { router as ProxyRouter } from "./../api/routes/v1";

/**
 * Instanciate Express application
 */
let app = Express();

/**
 * Expose body on req.body
 * 
 * @inheritdoc https://www.npmjs.com/package/body-parser
 */
app.use( BodyParser.urlencoded( { extended : false } ) );
app.use( BodyParser.json({ type: 'application/vnd.api+json' }) );

/**
 * GZIP compression
 * 
 * @inheritdoc https://github.com/expressjs/compression
 */
app.use( Compression() );

/**
 * Public resources
 */
app.use( Express.static('public') );

/**
 * Enable and set Helmet security middleware
 * 
 * @inheritdoc https://github.com/helmetjs/helmet
 */
app.use( Helmet() );

/**
 * Enable CORS - Cross Origin Resource Sharing
 * 
 * @inheritdoc https://www.npmjs.com/package/cors
 */
let CORSOptions = {
  origin: authorized,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use( Cors( CORSOptions) );

/**
 * Passport configuration
 * 
 * @inheritdoc http://www.passportjs.org/
 */
app.use( Passport.initialize() );

Passport.use('jwt', Strategies.jwt);
Passport.use('facebook', Strategies.facebook);
Passport.use('google', Strategies.google);

/**
 * Set validation engine
 */
app.use( ExpressValidator() );

/**
 * Configure API Rate limit
 * Note that you can also set limit on specific route path
 * 
 * @inheritdoc https://www.npmjs.com/package/express-rate-limit
 */
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const apiLimiter = RateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from this IP, please try again after an hour"
});

/**
 * Set RateLimit and Router(s) on paths
 */
app.use(`/api/${api}`, apiLimiter, ProxyRouter);

/**
 * Request logging with Morgan
 * dev : console | production : file
 * 
 * @inheritdoc https://github.com/expressjs/morgan
 */
if(env.toUpperCase() !== environments.TEST)
{
  app.use( Morgan(HTTPLogs) );
}

/**
 * Errors handlers
 */
if(env.toUpperCase() === environments.DEVELOPMENT || env.toUpperCase() === environments.TEST)
{
  app.use( ServiceErrorHandler.exit );
}
else
{
  app.use( ServiceErrorHandler.log, ServiceErrorHandler.exit );
}

app.use( ServiceErrorHandler.notFound );

/**
 * Exports Express
 */
export { app };