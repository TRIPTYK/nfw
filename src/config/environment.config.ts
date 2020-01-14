import * as Dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import {argv} from "yargs";

/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in
 * app.js
 */
const files = fs.readdirSync(".");
const environments = {};


for (const file of files) {
    if (file.includes(".env")) {
        const splited = file.split(".")[0].toUpperCase();
        environments[splited] = splited;
    }
}

const environment = argv.env && environments.hasOwnProperty((argv.env as string).toUpperCase()) ? argv.env : "development";

const envConfig = Dotenv.parse(fs.readFileSync(`${process.cwd()}/${environment}.env`));
for (const k in envConfig) {
    process.env[k] = envConfig[k] ;
}
Dotenv.config({path: `${process.cwd()}/${environment}.env`});

let authorized: any = process.env.AUTHORIZED.trim();
const env = process.env.NODE_ENV;
const port = process.env.PORT;
const url = process.env.URL;
authorized = authorized === "*" ? true : authorized.split(",");
const jwtSecret = process.env.JWT_SECRET;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
const api = process.env.API_VERSION;
const logs = process.env.NODE_ENV === "production" ? "combined" : "development";
const HTTPLogs = process.env.NODE_ENV === "production" ? "production" : "dev";
const facebook_id = process.env.FACEBOOK_APP_ID;
const facebook_secret = process.env.FACEBOOK_APP_SECRET;
const google_id = process.env.GOOGLE_CONSUMER_KEY;
const google_secret = process.env.GOOGLE_CONSUMER_SECRET;
const caching_enabled = parseInt(process.env.REQUEST_CACHING, 10);
const jwtAuthMode = process.env.JWT_AUTH_MODE;
const elastic_enable = parseInt(process.env.ELASTIC_ENABLE, 10);
const elastic_url = process.env.ELASTIC_URL;

const typeorm = {
    database: process.env.TYPEORM_DB,
    host: process.env.TYPEORM_HOST,
    name: process.env.TYPEORM_NAME,
    port: process.env.TYPEORM_PORT,
    pwd: process.env.TYPEORM_PWD,
    type: process.env.TYPEORM_TYPE,
    user: process.env.TYPEORM_USER
};

const jimp = {
    isActive: parseInt(process.env.JIMP_IS_ACTIVE, 10),
    md: parseInt(process.env.JIMP_SIZE_MD, 10),
    xl: parseInt(process.env.JIMP_SIZE_XL, 10),
    xs: parseInt(process.env.JIMP_SIZE_XS, 10)
};

const https = {
    ca: process.env.HTTPS_CHAIN,
    cert: process.env.HTTPS_KEY,
    isActive: parseInt(process.env.HTTPS_IS_ACTIVE, 10),
    key: process.env.HTTPS_KEY
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
    elastic_enable,
    elastic_url,
    jimp,
    caching_enabled,
    jwtAuthMode
};
