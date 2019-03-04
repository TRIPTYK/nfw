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
const mysqldump = require('mysqldump');

var db = mysql.createConnection({
    host: env.host,
    user: env.user,
    password: env.pwd,
    database: env.database
});

const query = util.promisify(db.query.bind(db));


/**
 * @description : get table foreign keys
 * @param {string} tableName
 */
exports.getForeignKeys = async (tableName) => {
    let result = await query(`SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA='${env.database}' AND TABLE_NAME='${tableName}';`);
    return result;
};


/**
 * @description : deletes a table
 * @param {string} tableName
 */
exports.dropTable = async (tableName) => {
  let result = await query(`DROP TABLE ${tableName};`);
  return result;
};

/**
 * @param {name of the table} tableName
 * @description get all data related to culmns of a table
 * @returns data of all the column from chosen table
 */
exports.getColumns = async (tableName) => {
    let result = await query(`SHOW COLUMNS FROM ${tableName} ;`);
    return result;
};


/**
 * @description checks if table exists
 * @param {string} tableName
 */
exports.tableExists = async (tableName) => {
  let result = await query(  `
    SELECT COUNT(*) as 'count'
    FROM information_schema.tables
    WHERE table_schema = '${env.database}'
    AND table_name = '${tableName}';
  `).catch(e => [{count : false}]);
  return result[0].count > 0;
};

/**
 * @returns get all name of table in a database
 */
exports.getTables = async () =>{
    result = await query(`SHOW TABLES`);
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
    return tableName;
}


/**
 * @description dump all into file
 * @param {string} path
 */
exports.dumpAll = async (path) => {
  // dump the result straight to a file
  await mysqldump({
      connection: {
          host: env.host,
          user: env.user,
          password: env.pwd,
          database: env.database,
      },
      dumpToFile: path + '.sql',
  });
};

/**
* @description dump a table into file
* @param {string} table
* @param {string} path
 */
exports.dumpTable = async (table,path) => {
  // dump the result straight to a file
  await mysqldump({
      connection: {
          host: env.host,
          user: env.user,
          password: env.pwd,
          database: env.database,
      },
      dump : {
         tables : [table]
      },
      dumpToFile: path + '.sql',
  })
};
