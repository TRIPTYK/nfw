const SqlAdaptator = require ('./database/sqlAdaptator');
const modelWrite = require ('./modelWrite')


/**
 * @author Verliefden Romain
 * @description get all table from DB then call writeModel method for each table in the database
 *
 */
<<<<<<< HEAD
_generateFromDB = async () =>{
    tables = await SqlAdaptator.getTables();
    tablesIn = await SqlAdaptator.getTablesInName();
    for(let j = 0;j<tables.length;j++){
        await modelWrite.writeModel(tables[j][tablesIn],"sql");
    };
=======
const _generateFromDB = async () =>{
    let p_tables = SqlAdaptator.getTables();
    let p_tablesIn = SqlAdaptator.getTablesInName();

    let [tables,tablesIn] = await Promise.all([p_tables,p_tablesIn]);

    tables.forEach(table => {
        modelWrite.writeModel(table[tablesIn],"sql");
    });
>>>>>>> 02a06b84f22f268f439ada9bf523661f8970e681
}


_generateFromDB();
