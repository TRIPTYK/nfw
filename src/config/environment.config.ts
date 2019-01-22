import * as Dotenv from "dotenv";
import { TypeORMConfiguration } from "./typeorm.config";

/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in 
 * app.js
 */
const environments = { DEVELOPMENT : 'DEVELOPMENT' , STAGING : 'STAGING', PRODUCTION : 'PRODUCTION' };

const environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.hasOwnProperty(process.argv[3].toUpperCase()) ? process.argv[3] : 'development';

Dotenv.config( { path : `${process.cwd()}/${environment}.env` } );

const env = process.env.NODE_ENV;
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
const connection = (async function(TypeORMConfiguration) { return await TypeORMConfiguration.getConnection() } ) (TypeORMConfiguration);
const api = process.env.API_VERSION;
const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'development';
const HTTPLogs = process.env.NODE_ENV === 'production' ? 'production' : 'dev';

export { env, environments, port, jwtSecret, jwtExpirationInterval, connection, api, logs, HTTPLogs };