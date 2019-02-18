/**
 * @module modelWrite
 * @author Verliefden Romain
 * @description this module write the model.ts based on columns of the database
 * if the table exist. If the table doesn't exist , the user enter the columns of
 * the futur table and the table is created in the database.
 * @exports writeModel
 */

const sqlAdaptator = require('./database/sqlAdaptator');
//const mongoAdaptator = require('./database/mongoAdaptator');
const Util = require('util');
const Log = require('./log');
const FS = require('fs');
const ReadFile = Util.promisify(FS.readFile);
const Exists = Util.promisify(FS.exists);
const colors = require('colors/safe');
const dbWrite = require('./databaseWrite');

/**
 *
 * @param {Technology use for database} dbType
 * @param {name of the table in database} tableName
 * @description call getColumns function in correct adapator to get data of columns
 * @returns data of a table
 */
const _getTableInfo = async (dbType,tableName) => {
    if(dbType === "sql"){
        return data = await sqlAdaptator.getColumns(tableName);
    }else{
        console.log(colors.Rainbow(dbType+" is not supported by this method yet"));
        process.exit(0);
    }
    return [];
}

/**
 *
 * @param {data of a column} data
 * @description mysql send data(lenght). Therefore, I need to split if i only want
 * the datatype.
 * @returns data type
 */
const _dataWithoutLenght= (data) =>{
    type = data.split('(')
    return `"${type[0]}"`;
}

/**
 *
 * @param {column data} data
 * @description mysql send data(lenght/enumList). Therefore , if i only need the lenght/enumList I need to split
 * split then delete the ')'
 * @returns data lenght/enum
 */
const _getLength = (data) =>{
    type = data.split('(');
    if(type[0] === "enum"){
        let better = type[1].replace(')',"") ;
        return "enum  : ["+better+"],";
    }
    else if(type[1] != null){
        if(type[1].includes('int')){
            let better = type[1].replace(')',"") ;
            return "width : "+better+",";
        }else{
        let better = type[1].replace(')',"") ;
        return "length : "+better+",";
        }
    }else{
        return "";
    }
}

const _getUnique = (data) => {
    if(data === 'YES'){
        return 'true'
    }else{
        return 'false'
    }
}

const _getKey = data =>{
    if (data === 'PRI'){
        return ' primary : true,'
    }else if ( data === 'UNI'){
        return ' unique : true,'
    }else{
        return '';
    }
}

exports.getTableInfo = _getTableInfo;

const _dateDefaultIsNow = (data,def) =>{
    type = data.split('(');
    if(type[0] === "datetime" && def != null){
        return "DateUtils.mixedDateToDateString( new Date() )";
    }else {
        return def;
    }
}

exports.writeModel = async (table,dbType) =>{
    let capitalize  = table[0].toUpperCase() + table.substr(1);
    let lowercase   = table[0].toLowerCase() + table.substr(1);
    let path = `${process.cwd()}/src/api/models/${lowercase}.model.ts`
    let file = await ReadFile(`${process.cwd()}/cli/generate/templates/modelTemplates/modelHeader.txt`, 'utf-8');
    let colTemp = await ReadFile(`${process.cwd()}/cli/generate/templates//modelTemplates/modelColumn.txt`, 'utf-8');

    try{
        data = await _getTableInfo(dbType,table);
    }catch(err){
        data = await dbWrite.dbParams(table);
    }

    let entities='';
    data.forEach(async col =>{
        if(col.Field === "id")
            return;

        let entitiesTemp = colTemp
          .replace(/{{ROW_NAME}}/ig, col.Field)
          .replace(/{{ROW_DEFAULT}}/ig, _dateDefaultIsNow(col.Type,col.Default))
          .replace(/{{ROW_LENGHT}}/ig, _getLength(col.Type))
          .replace(/{{ROW_NULL}}/ig, _getUnique(col.Null))
          .replace(/{{ROW_CONSTRAINT}}/ig, _getKey(col.Key))
          .replace(/{{ROW_TYPE}}/ig, _dataWithoutLenght(col.Type));
        entities += ' '+entitiesTemp +"\n\n" ;
    });

    let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize)
      .replace(/{{ENTITIES}}/ig, entities);

    FS.writeFile(path, output, (err) => {
      console.log(colors.green("Model created in :"+path));
      Log.info("Dont forget to update your /src/config/typeorm.config.ts entities");
    });
}
