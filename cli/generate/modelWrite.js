const sqlAdaptator = require('./database/sqlAdaptator');
//const mongoAdaptator = require('./database/mongoAdaptator');
const Util = require('util');
const FS = require('fs');
const ReadFile = Util.promisify(FS.readFile);

const getTableInfo = async (dbType,tableName) => {
    if(dbType === "sql"){
        return data = await sqlAdaptator.getColumns(tableName);
    }else if(dbType === "mongodb"){
        //return data = mongoAdaptator.getColumns(tableName);
    }else{
        console.log(colors.Rainbow(dbType+" is not supported by this method yet"));
        process.exit(0);
    }
    return data="banane";
}

exports._writeModel = async (table,dbType) =>{
       data = await getTableInfo(dbType,table);
       console.log(data);
       console.log(data[0].Field);
       let capitalize  = table[0].toUpperCase() + table.substr(1);
       let lowercase   = table[0].toLowerCase() + table.substr(1);
       let file = await ReadFile(`${process.cwd()}/cli/generate/templates/modelHeader.txt`, 'utf-8');
       let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);
      let ColTemp = await ReadFile(`${process.cwd()}/cli/generate/templates/modelColumn.txt`, 'utf-8');
      data.forEach(async col =>{
           console.log(col.Field)
            let colFinal = ColTemp
            .replace(/{{ROW_NAME}}/ig, col.Field)
            .replace(/{{ROW_DEFAULT}}/ig, col.Default) 
            .replace(/{{ROW_TYPE}}/ig, col.Type);
            output += colFinal +"\n\n" ;
      });
      console.log(output);
      

}

