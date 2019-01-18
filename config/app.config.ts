import * as Express from "express";
import { Request, Response } from "express";
import * as BodyParser from "body-parser";
import * as Morgan from "morgan";
import * as Cors from "cors";
import * as Compression from "compression";
import * as Passport from "passport";
import * as ErrorHandler from "errorhandler";
import * as ExpressValidator from "express-validator";
import * as ServiceErrorHandler from "./../api/services/error-handler";
import * as Strategies from "./passport.config";

const Router = require('./../api/routes/v1');

const { HTTPLogs, api, env, environments } = require('./environment.config');

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
  app.use( ErrorHandler( { log : ServiceErrorHandler.notify } ));
}
else
{
  app.use( ErrorHandler( { log : ServiceErrorHandler.log } ));
}

/**
 * Exports Express
 */
module.exports = app;