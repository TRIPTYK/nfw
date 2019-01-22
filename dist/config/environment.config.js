"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dotenv = require("dotenv");
var MySQL = require("./mysql.config");
/**
 * Configure dotenv with variables.env file before app, to allow process.env accessibility in
 * app.js
 */
var environments = { DEVELOPMENT: 'DEVELOPMENT', STAGING: 'STAGING', PRODUCTION: 'PRODUCTION' };
var environment = process.argv[2] && process.argv[2] === '--env' && process.argv[3] && environments.hasOwnProperty(process.argv[3].toUpperCase()) ? process.argv[3] : 'development';
Dotenv.config({ path: process.cwd() + "/" + environment + ".env" });
module.exports = {
    env: process.env.NODE_ENV,
    environments: environments,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    dbConnection: MySQL.getConnection(),
    mongo: {
        uri: process.env.NODE_ENV === 'test'
            ? process.env.MONGO_URI_TESTS
            : process.env.MONGO_URI,
    },
    api: process.env.API_VERSION,
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'development',
    HTTPLogs: process.env.NODE_ENV === 'production' ? 'production' : 'dev',
};