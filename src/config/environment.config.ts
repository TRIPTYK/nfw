import * as Dotenv from "dotenv";
import * as fs from 'fs';

/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in
 * app.js
 */
let files = fs.readdirSync('./');
let environments = {};
files.forEach(element => {
    if (element.includes('.env')) {
        let splited = element.split('.')[0].toUpperCase();
        environments[splited] = splited;
    }
});

//const environments = { DEVELOPMENT : 'DEVELOPMENT' , STAGING : 'STAGING', PRODUCTION : 'PRODUCTION', TEST : 'TEST' };

const environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.hasOwnProperty(process.argv[3].toUpperCase()) ? process.argv[3] : 'development';

const envConfig = Dotenv.parse(fs.readFileSync(`${process.cwd()}/${environment}.env`));
for (let k in envConfig) {
    process.env[k] = envConfig[k]
}
Dotenv.config({path: `${process.cwd()}/${environment}.env`});

let authorized: any = process.env.AUTHORIZED.trim();

const env = process.env.NODE_ENV;
const port = process.env.PORT;
const url = process.env.URL;
authorized = authorized === "*" ? true : authorized.split(',');
const jwtSecret = process.env.JWT_SECRET;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
const api = process.env.API_VERSION;
const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'development';
const HTTPLogs = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const facebook_id = process.env.FACEBOOK_APP_ID;
const facebook_secret = process.env.FACEBOOK_APP_SECRET;
const google_id = process.env.GOOGLE_CONSUMER_KEY;
const google_secret = process.env.GOOGLE_CONSUMER_SECRET;
const caching_enabled = parseInt(process.env.REQUEST_CACHING);
const jwtAuthMode = process.env.JWT_AUTH_MODE;

const typeorm = {
    type: process.env.TYPEORM_TYPE,
    name: process.env.TYPEORM_NAME,
    port: process.env.TYPEORM_PORT,
    host: process.env.TYPEORM_HOST,
    database: process.env.TYPEORM_DB,
    user: process.env.TYPEORM_USER,
    pwd: process.env.TYPEORM_PWD
};

const jimp = {
    isActive: parseInt(process.env.JIMP_IS_ACTIVE),
    xs: parseInt(process.env.JIMP_SIZE_XS),
    md: parseInt(process.env.JIMP_SIZE_MD),
    xl: parseInt(process.env.JIMP_SIZE_XL),
};

const https = {
    isActive: parseInt(process.env.HTTPS_IS_ACTIVE),
    key: process.env.HTTPS_KEY,
    cert: process.env.HTTPS_KEY,
    ca: process.env.HTTPS_CHAIN
};

export {
    env,
    environments,
    port,
    url,
    authorized,
    https,
    jwtSecret,
    jwtExpirationInterval,
    api,
    facebook_id,
    facebook_secret,
    google_id,
    google_secret,
    HTTPLogs,
    typeorm,
    jimp,
    caching_enabled,
    jwtAuthMode
};
