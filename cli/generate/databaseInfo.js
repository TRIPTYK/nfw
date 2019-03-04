const sqlAdaptator = require('./database/sqlAdaptator');
const Log = require('./log');

/**
 * @param {Technology use for database} dbType
 * @param {name of the table in database} tableName
 * @description call getColumns function in correct adapator to get data of columns
 * @returns data of a table
 */
exports.getTableInfo = async (dbType,tableName) => {
    if(dbType === "sql"){
        let p_columns = sqlAdaptator.getColumns(tableName);
        let p_foreignKeys = sqlAdaptator.getForeignKeys(tableName);
        let [columns,foreignKeys] = await Promise.all([p_columns,p_foreignKeys]);

        return {columns,foreignKeys};
    }else{
        Log.rainbow(dbType + " is not supported by this method yet");
        process.exit(0);
    }
    return {columns : [],foreignKeys : []};
}


/**
 * @param {name of the table in database} tableName
 * @description Check if table exists in database
 * @returns table exists
 */
exports.tableExistsInDB = async (tableName) => {
     return (
       await sqlAdaptator.tableExists(tableName)
        .catch(e => {
          Log.error("Failed to connect to database");
          return false;
        })
   );
};
