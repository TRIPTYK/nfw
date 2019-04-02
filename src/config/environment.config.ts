import * as Dotenv from "dotenv";
import * as fs from 'fs';

/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in
 * app.js
 */
const environments = { DEVELOPMENT : 'DEVELOPMENT' , STAGING : 'STAGING', PRODUCTION : 'PRODUCTION', TEST : 'TEST' };

const environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.hasOwnProperty(process.argv[3].toUpperCase()) ? process.argv[3] : 'development';

const envConfig = Dotenv.parse(fs.readFileSync(`${process.cwd()}/${environment}.env`));
for (let k in envConfig) {
  process.env[k] = envConfig[k]
}
Dotenv.config( { path : `${process.cwd()}/${environment}.env` } );

let authorized : any = process.env.AUTHORIZED.trim();

const env                   = process.env.NODE_ENV;
const port                  = process.env.PORT;
const url                   = process.env.URL;
authorized                  = authorized === "*" ? true : authorized.split(',');
const jwtSecret             = process.env.JWT_SECRET;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
const api                   = process.env.API_VERSION;
const logs                  = process.env.NODE_ENV === 'production' ? 'combined' : 'development';
const HTTPLogs              = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const typeorm               = {
  type: process.env.TYPEORM_TYPE,
  name: process.env.TYPEORM_NAME,
  port: process.env.TYPEORM_PORT,
  host: process.env.TYPEORM_HOST,
  database: process.env.TYPEORM_DB,
  user: process.env.TYPEORM_USER,
  pwd: process.env.TYPEORM_PWD
};
const jimp                  = {
  isActive: parseInt(process.env.JIMP_IS_ACTIVE),
  xs: parseInt(process.env.JIMP_SIZE_XS),
  md: parseInt(process.env.JIMP_SIZE_MD),
  xl: parseInt(process.env.JIMP_SIZE_XL),
};
const https                 = {
  isActive: parseInt(process.env.HTTPS_IS_ACTIVE),
  key: process.env.HTTPS_KEY,
  cert: process.env.HTTPS_KEY
};

export { env, environments, port, url, authorized, https, jwtSecret, jwtExpirationInterval, api, logs, HTTPLogs, typeorm, jimp };
