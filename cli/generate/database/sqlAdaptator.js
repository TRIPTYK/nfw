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

exports.getForeignKeys = async (tableName) => {
    let result = await query(`SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA='${env.database}' AND TABLE_NAME='${tableName}';`);
    return result;
};

exports.getColumns = async (tableName) => {
    let result = await query(`SHOW COLUMNS FROM ${tableName} ;`);
    return result;
};

exports.createTable = async (tableData,entity) =>{
    sql = `CREATE TABLE ${entity} ( id int PRIMARY KEY,`
    tableData.forEach(element => {
        sql += `${element.Field} ${element.Type} DEFAULT ${element.Default},`
    });
    sql = sql.substr(0,sql.length-1);
    sql +=');'
    console.log(sql);
    let query = util.promisify(db.query.bind(db));
    await query(sql) ;
}
