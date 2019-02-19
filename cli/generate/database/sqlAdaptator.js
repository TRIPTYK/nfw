/**
 * @module sqlAdapatator
 * @author Verliefden Romain
 * @description this module provide method to get data from a sql database.
 * @exports getColumns 
 * @exports getTables
 * @exports getTablesInName
 */


const mysql = require('mysql');
const env = require('./databaseEnv');
const util = require('util');


var db = mysql.createConnection({
    host: env.host,
    user: env.user,
    password: env.pwd,
    database: env.database
});

const query = util.promisify(db.query.bind(db));

/**
 * @param {name of the table} tableName
 * @description get all data related to culmns of a table
 * @returns data of all the column from chosen table
 */
exports.getColumns = async (tableName) => {
    var result;
    sql = `SHOW COLUMNS FROM ${tableName} ;`
    result = await query(sql) ;
    return result;
};

/**
 * @returns get all name of table in a database
 */
exports.getTables = async () =>{
    sql = `SHOW TABLES`;
    result = await query(sql);
    return result;

}

/**
 * @description as name of table are given in a associative array where the field wich contains the table is Tables_In_dbName . i need this so that
 * i can get the correct field
 * 
 * @returns Tabls_in_dbName
 */
exports.getTablesInName = async () =>{
    let tableName = "Tables_in_"+env.database.replace('-','_');
    console.log(tableName);
    return tableName
}