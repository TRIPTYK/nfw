import * as Express from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as ExpressValidator from "express-validator";
import * as ServiceErrorHandler from "../api/services/error-handler.service";

import { strategies as Strategies } from "./passport.config";
import { HTTPLogs, api, env, environments } from "./environment.config";

const Router = require('./../api/routes/v1');

/**
 * Instanciate Express application
 */
const app = Express();

/**
 * GZIP compression
 */
app.use( Compression() );

/**
 * Public resources
 */
app.use( Express.static('public') );

/**
 * Expose body on req.body
 */
app.use( BodyParser.json() );
app.use( BodyParser.urlencoded( { extended : true } ) );

/**
 * Enable CORS - Cross Origin Resource Sharing
 */
app.use( Cors() );

/**
 * Passport configuration
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
 * Set Router(s) on paths
 */
app.use(`/api/${api}`, Router);

/**
 * Request logging with Morgan
 * dev : console | production : file
 */
app.use( Morgan(HTTPLogs) );

/**
 * Errors handlers
 */
if(env.toUpperCase() === environments.DEVELOPMENT)
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