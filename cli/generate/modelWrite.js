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
const inquirer = require('inquirer');
const Util = require('util');
const Log = require('./log');
const FS = require('fs');
const ReadFile = Util.promisify(FS.readFile);
const colors = require('colors/safe');
const dbWrite = require('./databaseWrite');
const { countLines , capitalizeEntity , removeEmptyLines } = require('./utils');
const inquirer = require('inquirer');
const options = [{type:'list',name:'value',message:'Entity doesn\'t exist. What must be done ',default:'create an entity',choices:['create an entity','create a basic model','nothing']}]


/**
 *
 * @param {Technology use for database} dbType
 * @param {name of the table in database} tableName
 * @description call getColumns function in correct adapator to get data of columns
 * @returns data of a table
 */
const _getTableInfo = async (dbType,tableName) => {
    if(dbType === "sql"){
        let p_columns = sqlAdaptator.getColumns(tableName);
        let p_foreignKeys = sqlAdaptator.getForeignKeys(tableName);
        let res = await Promise.all([p_columns,p_foreignKeys]);

        return {
          columns : res[0],
          foreignKeys : res[1]
        };
    }else{
        console.log(colors.Rainbow(dbType+" is not supported by this method yet"));
        process.exit(0);
    }
    return {columns : [],foreignKeys : []};
}

/**
 *
 * @param {type(n) of a  column} data
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
 * @param {type(n) of a column} data
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
        if(type[0].includes('int')){
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


/**
 *
 * @param {column Nullable data} data
 * @description  check if column can be null or not and check if key is primay. if key is primary , there's no need to check if column can be null
 * because primary imply that value can't be null 
 * @returns if column can be null or not
 */
const _getNull = (data,key) => {
    if(key === 'PRI'){
        return ''
    }else if(data === 'YES' && key != 'PRI'){
        return 'nullable:true,'
    }else{
        return 'nullable:false,'
    }
}

/**
 *
 * @param {column key data} data
 * @description  mysql send key value as PRI , UNI. but a column written for a typeorm model primary or unique as parameter 
 * @returns primary or unique
 */
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

/**
 * @param {table to get data from/table to create} table
 * @param {techonlogy use for database} dbType
 * 
 * @description get data from DB then write a model based on said data. If there's no data in database for cosen table then ask the user 
 * if he want a basic model or get him to a prompt to create a new column or if nothing need to done. 
 * 
 *  
 */
exports.writeModel = async (table,dbType) =>{
    console.log("banane");
    let capitalize  = table[0].toUpperCase() + table.substr(1);
    let lowercase   = table[0].toLowerCase() + table.substr(1);
    let path = `${process.cwd()}/src/api/models/${lowercase}.model.ts`
    let file = await ReadFile(`${process.cwd()}/cli/generate/templates/modelTemplates/modelHeader.txt`, 'utf-8');
    let ColTemp = await ReadFile(`${process.cwd()}/cli/generate/templates//modelTemplates/modelColumn.txt`, 'utf-8');
    let data;
    try{
        data = await _getTableInfo(dbType,table);
    }catch(err){
        let option = await inquirer.prompt(options);
        if(option.value === 'create an entity' )data = await dbWrite.dbParams(table);
        else if(option.value === 'create a basic model'){
            let modelTemp = await ReadFile(`${process.cwd()}/cli/generate/templates/model.txt`);
            let basicModel = (" "+modelTemp)
            .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
            .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);
            await FS.writeFile(path, basicModel, (err) => {
            console.log(colors.green("Model created in :"+path));
            process.exit(0);
        });
        }else process.exit(0);
    }
    if( data != null){
        var Entities='';
        data.forEach(async col =>{
            if(col.Field === "id"){
                return;
            }
            let EntitiesTemp = ColTemp
            .replace(/{{ROW_NAME}}/ig, col.Field)
            .replace(/{{ROW_DEFAULT}}/ig, col.Default)
            .replace(/{{ROW_LENGHT}}/ig, _getLength(col.Type))
            .replace(/{{ROW_NULL}}/ig, _getNull(col.Null,col.Key))
            .replace(/{{ROW_CONSTRAINT}}/ig, _getKey(col.Key))
            .replace(/{{ROW_TYPE}}/ig, _dataWithoutLenght(col.Type));
            Entities += ' '+EntitiesTemp +"\n\n" ;
        });
        let output = file
        .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
        .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize)
        .replace(/{{ENTITIES}}/ig, Entities);
        FS.writeFile(path, output, (err) => {
        console.log(colors.green("Model created in :"+path));
        });
    }
}


