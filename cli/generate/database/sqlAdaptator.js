const mysql = require('mysql');
const env = require('./databaseEnv');
const util = require('util');

var db = mysql.createConnection({
    host: env.host,
    user: env.user,
    password: env.pwd,
    database: env.database
});


exports.getColumns = async (tableName) => {
    var result;
    sql = `SHOW COLUMNS FROM ${tableName} ;`
    let query = util.promisify(db.query.bind(db));
    result = await query(sql) ;
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