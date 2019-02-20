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

    tables.forEach(table => {
        modelWrite.writeModel(table[tablesIn],"sql");
    });
}


_generateFromDB();
