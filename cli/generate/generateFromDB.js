const SqlAdaptator = require ('./database/sqlAdaptator');
const modelWrite = require ('./modelWrite')


/**
 * @author Verliefden Romain
 * @description get all table from DB then call writeModel method for each table in the database
 *
 */
const _generateFromDB = async () =>{
    let p_tables = SqlAdaptator.getTables();
    let p_tablesIn = SqlAdaptator.getTablesInName();

    let [tables,tablesIn] = await Promise.all([p_tables,p_tablesIn]);

    for(let j = 0;j<tables.length;j++){
        await modelWrite.writeModel(tables[j][tablesIn],"sql");
    };
}

_generateFromDB();
