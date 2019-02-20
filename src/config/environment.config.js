"use strict";
exports.__esModule = true;
var Dotenv = require("dotenv");
/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in
 * app.js
 */
var environments = { DEVELOPMENT: 'DEVELOPMENT', STAGING: 'STAGING', PRODUCTION: 'PRODUCTION', TEST: 'TEST' };
exports.environments = environments;
var environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.hasOwnProperty(process.argv[3].toUpperCase()) ? process.argv[3] : 'development';
Dotenv.config({ path: process.cwd() + "/" + environment + ".env" });
var env = process.env.NODE_ENV;
exports.env = env;
var port = process.env.PORT;
exports.port = port;
var url = process.env.URL;
exports.url = url;
var authorized = process.env.AUTHORIZED.trim().split(',');
exports.authorized = authorized;
var jwtSecret = process.env.JWT_SECRET;
exports.jwtSecret = jwtSecret;
var jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES;
exports.jwtExpirationInterval = jwtExpirationInterval;
var api = process.env.API_VERSION;
exports.api = api;
var logs = process.env.NODE_ENV === 'production' ? 'combined' : 'development';
exports.logs = logs;
var HTTPLogs = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
exports.HTTPLogs = HTTPLogs;
var typeorm = {
    type: process.env.TYPEORM_TYPE,
    name: process.env.TYPEORM_NAME,
    port: process.env.TYPEORM_PORT,
    host: process.env.TYPEORM_HOST,
    database: process.env.TYPEORM_DB,
    user: process.env.TYPEORM_USER,
    pwd: process.env.TYPEORM_PWD
};
exports.typeorm = typeorm;
var jimp = {
    isActive: parseInt(process.env.JIMP_IS_ACTIVE),
    xs: parseInt(process.env.JIMP_SIZE_XS),
    md: parseInt(process.env.JIMP_SIZE_MD),
    xl: parseInt(process.env.JIMP_SIZE_XL)
};
exports.jimp = jimp;
var https = {
    isActive: parseInt(process.env.HTTPS_IS_ACTIVE),
    key: process.env.HTTPS_KEY,
    cert: process.env.HTTPS_KEY
};
exports.https = https;
