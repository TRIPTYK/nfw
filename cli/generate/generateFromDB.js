const SqlAdaptator = require ('./database/sqlAdaptator');
const modelWrite = require ('./modelWrite');
const index = require ('./index')

// basic peoject tables to ignore
const noGenerate = ['user','document','refresh_token','migration_table'];

/**
 * @author Verliefden Romain
 * @description get all table from DB then call writeModel method for each table in the database
 */
module.exports = async () =>{
    let p_tables = SqlAdaptator.getTables();
    let p_tablesIn = SqlAdaptator.getTablesInName();

    let [tables,tablesIn] = await Promise.all([p_tables,p_tablesIn]);

    for(let j = 0;j<tables.length;j++){
        if(!noGenerate.includes(tables[j][tablesIn])) {
            await index(tables[j][tablesIn],'crud');
            await modelWrite('db',tables[j][tablesIn]);
        }
   };
   process.exit(0);
};
