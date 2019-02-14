/**
 * Exports environment settings for the database from the .env file in the root foler
 */
const dotenv = require('dotenv');

let environment =  "development";

dotenv.config( { path : `${process.cwd()}/${environment}.env` } );
const env = process.env.NODE_ENV;
const type = process.env.TYPEORM_TYPE;
const name = process.env.TYPEORM_NAME;
const port = process.env.TYPEORM_PORT;
const host = process.env.TYPEORM_HOST;
const database = process.env.TYPEORM_DB;
const user = process.env.TYPEORM_USER;
const pwd = process.env.TYPEORM_PWD;

module.exports = {type,name,port,host,database,user,pwd};
