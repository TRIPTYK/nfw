"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dotenv = require("dotenv");
const fs = require("fs");
/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in
 * app.js
 */
const environments = { DEVELOPMENT: 'DEVELOPMENT', STAGING: 'STAGING', PRODUCTION: 'PRODUCTION', TEST: 'TEST' };
exports.environments = environments;
const environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.hasOwnProperty(process.argv[3].toUpperCase()) ? process.argv[3] : 'development';
const envConfig = Dotenv.parse(fs.readFileSync(`${process.cwd()}/${environment}.env`));
for (let k in envConfig) {
    process.env[k] = envConfig[k];
}
Dotenv.config({ path: `${process.cwd()}/${environment}.env` });
let authorized = process.env.AUTHORIZED.trim();
exports.authorized = authorized;
const env = process.env.NODE_ENV;
exports.env = env;
const port = process.env.PORT;
exports.port = port;
const url = process.env.URL;
exports.url = url;
exports.authorized = authorized = authorized === "*" ? true : authorized.split(',');
const jwtSecret = process.env.JWT_SECRET;
exports.jwtSecret = jwtSecret;
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
exports.jwtExpirationInterval = jwtExpirationInterval;
const api = process.env.API_VERSION;
exports.api = api;
const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'development';
exports.logs = logs;
const HTTPLogs = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
exports.HTTPLogs = HTTPLogs;
const typeorm = {
    type: process.env.TYPEORM_TYPE,
    name: process.env.TYPEORM_NAME,
    port: process.env.TYPEORM_PORT,
    host: process.env.TYPEORM_HOST,
    database: process.env.TYPEORM_DB,
    user: process.env.TYPEORM_USER,
    pwd: process.env.TYPEORM_PWD
};
exports.typeorm = typeorm;
const jimp = {
    isActive: parseInt(process.env.JIMP_IS_ACTIVE),
    xs: parseInt(process.env.JIMP_SIZE_XS),
    md: parseInt(process.env.JIMP_SIZE_MD),
    xl: parseInt(process.env.JIMP_SIZE_XL),
};
exports.jimp = jimp;
const https = {
    isActive: parseInt(process.env.HTTPS_IS_ACTIVE),
    key: process.env.HTTPS_KEY,
    cert: process.env.HTTPS_KEY
};
exports.https = https;
