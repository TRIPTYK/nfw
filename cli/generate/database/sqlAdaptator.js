const mysql = require('mysql');
const env = require('./databaseEnv');
const util = require('util');

var db = mysql.createConnection({
    host: env.host,
    user: env.user,
    password: env.pwd,
    database: env.database
});

exports.db = db ;

exports.getColumns = async (tableName) => {
    console.log(env.host);
    console.log(env.user);
    console.log(env.pwd);
    console.log(env.database);
    var result;
    console.log(db.query);
    sql = `SHOW COLUMNS FROM ${tableName} ;`
    let query = util.promisify(db.query.bind(db));
    result = await query(sql) ;
    return result;
};
