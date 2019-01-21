import * as Dotenv from "dotenv";

/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in 
 * app.js
 */
const environments = { DEVELOPMENT : 'DEVELOPMENT' , STAGING : 'STAGING', PRODUCTION : 'PRODUCTION' };

const environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.includes(process.argv[3].toUpperCase()) !== -1 ? process.argv[3] : 'development';

Dotenv.config( { path : `${process.cwd()}/${environment}.env` } );

module.exports = {
  env: process.env.NODE_ENV,
  environments: environments,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
  api: process.env.API_VERSION,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'development',
  HTTPLogs: process.env.NODE_ENV === 'production' ? 'production' : 'dev',
};