const SqlAdaptator = require ('./database/sqlAdaptator');
const modelWrite = require ('./modelWrite')


/**
 * @author Verliefden Romain
 * @description get all table from DB then call writeModel method for each table in the database 
 * 
 */
_generateFromDB = async () =>{
    tables = await SqlAdaptator.getTables();
    tablesIn = await SqlAdaptator.getTablesInName();
    for(let j = 0;j<tables.length;j++){
        await modelWrite.writeModel(tables[j][tablesIn],"sql");
    };
}


_generateFromDB();