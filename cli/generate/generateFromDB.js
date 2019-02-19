const SqlAdaptator = require ('./database/sqlAdaptator');
const modelWrite = require ('./modelWrite')


/**
 * @author Verliefden Romain
 * @description get all table from DB then call writeModel method for each table in the database 
 * 
 */
_generateFromDB = async () =>{
    tables = await SqlAdaptator.getTables();
    console.log(tables);
    tablesIn = await SqlAdaptator.getTablesInName();
    tables.forEach(table => {
        modelWrite.writeModel(table[tablesIn],"sql");
    });
}


_generateFromDB();