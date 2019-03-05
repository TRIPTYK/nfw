/**
 * @module modelWrite
 * @author Verliefden Romain
 * @description this module write the model.ts based on columns of the database
 * if the table exist. If the table doesn't exist , the user enter the columns of
 * the futur table and the table is created in the database.
 * @exports writeModel
 */
const ejs = require('ejs');
const sqlAdaptator = require('./database/sqlAdaptator');
//const mongoAdaptator = require('./database/mongoAdaptator');
const inquirer = require('inquirer');
const Util = require('util');
const Log = require('./log');
const FS = require('fs');
const databaseInfo = require('./databaseInfo');
const ReadFile = Util.promisify(FS.readFile);
const WriteFile = Util.promisify(FS.writeFile);
const path = require('path');
const {  capitalizeEntity , fileExists, removeEmptyLines , writeToFirstEmptyLine , isImportPresent , lowercaseEntity , sqlTypeData } = require('./utils');

var lowercase;
var capitalize;


/**
 *
 * @param {Array} col
 * @description set default value for the column and check that default is not null when value can't be null
 * @returns default : value or nothing
 */
const _getDefault = (col) =>{
  console.log(col);
  if (col.Default === null){
    if(col.Null === 'NO' || col.Key=== 'PRI') return '';
    else return 'default : null'; 
  }else if (col.Type.type.includes('int') || col.Type.type === 'float' || col.Type.type ==='double'){
    return `default : ${col.Default}`;
  }else if (col.Default === ':no'){
    return '';
  }else{
    return `default :"${col.Default}"`;
  }
}


/**
 *
 * @param {String} data
 * @param {String} key
 * @description  check if column can be null or not and check if key is primay. if key is primary , there's no need to check if column can be null
 * because primary imply that value can't be null
 * @returns if column can be null or not
 */
const _getNull = (data,key) => {
    if(key === 'PRI') return '';
    if(data === 'YES' && key != 'PRI') return 'nullable:true,';
    return 'nullable:false,';
}

/**
*  @param {String} lowercase
*  @param {String} capitalize
 * @description
 * @returns {null}
 **/
const _addToConfig = async (lowercase,capitalize) => {
    let configFileName = `${process.cwd()}/src/config/typeorm.config.ts`;
    let fileContent = await ReadFile(configFileName, 'utf-8');

    if (!isImportPresent(fileContent,capitalize)) {
      let imprt = writeToFirstEmptyLine(fileContent,`import { ${capitalize} } from "../api/models/${lowercase}.model";\n`)
        .replace(/(.*entities.*)(?=])(.*)/,`$1,${capitalize}$2`);

      await WriteFile(configFileName,imprt).catch(e => {
        Log.error(`Failed to write to : ${configFileName}`);
      });
    }
};

/**
 *
 * @param {column key data} data
 * @description  mysql send key value as PRI , UNI. but a column written for a typeorm model primary or unique as parameter
 * @returns primary or unique
 */
const _getKey = data => {
    if (data === 'PRI') return ' primary : true,';
    if (data === 'UNI') return ' unique : true,';
    return '';
}

/**
 * @param {table to get data from/table to create} table
 * @param {techonlogy use for database} dbType
 *
 * @description get data from DB then write a model based on said data. If there's no data in database for cosen table then ask the user
 * if he want a basic model or get him to a prompt to create a new column or if nothing need to done.
 *
 */
const writeModel = async (action,data=null) =>{
    let lowercase = lowercaseEntity(action);
    let capitalize  = capitalizeEntity(lowercase);

    let p_file = await ReadFile(`${process.cwd()}/cli/generate/templates/model/model.ejs`, 'utf-8');
    let pathModel = path.resolve(`${process.cwd()}/src/api/models/${lowercase}.model.ts`);

    if(data == null) data = await databaseInfo.getTableInfo('sql',lowercase);

    let { columns , foreignKeys } = data;
    let entities = [] , f_keys = [] , imports = [];

    await Promise.all(columns.map(async col =>{
        if(col.Field === "id") return;
        let foreignKey = foreignKeys.find(elem => elem.COLUMN_NAME == col.Field);

        if (foreignKey) {
            let low = foreignKey.REFERENCED_TABLE_NAME;
            let cap = capitalizeEntity(low);

            f_keys.push(foreignKey);

            if (foreignKey.REFERENCED_TABLE_NAME != foreignKey.TABLE_NAME)
              imports.push(`import {${cap}} from './${low}.model';`);
          }else{
            col.Type = sqlTypeData(col.Type);
            col.Null = _getNull(col.Null);
            col.Key = _getKey(col.Key);
            col.Default = _getDefault(col);

            entities.push(col);
          }
        }));

      let output = ejs.compile(p_file,{root : `${process.cwd()}/cli/generate/templates/`})({
        entityLowercase : lowercase,
        entityCapitalize : capitalize,
        entities,
        imports,
        foreignKeys : f_keys,
        createUpdate : data.createUpdate,
        capitalizeEntity,
        lowercaseEntity
      });

      await Promise.all([WriteFile(pathModel, output),_addToConfig(lowercase,capitalize)]);
      Log.success("Model created in :" + pathModel);
}

/**
 *  @description creates a basic model , with no entites , imports or foreign keys
 */
const basicModel = async (action) => {
  let lowercase = lowercaseEntity(action);
  let capitalize  = capitalizeEntity(lowercase);
  let pathModel = path.resolve(`${process.cwd()}/src/api/models/${lowercase}.model.ts`);
  let modelTemp = await ReadFile(`${process.cwd()}/cli/generate/templates/model/model.ejs`);

  let basicModel = ejs.compile(modelTemp.toString())({
    entityLowercase : lowercase,
    entityCapitalize : capitalize,
    entities : [],
    imports : [],
    foreignKeys : [],
    createUpdate : null
  });

  let p_write = WriteFile(pathModel, basicModel)
    .then(() => Log.success("Model created in :" + pathModel))
    .catch(e => Log.error("Failed generating model"));

  await Promise.all([_addToConfig(lowercase,capitalize),p_write])
}

module.exports = async (action,name,data=undefined) => {
  if(action == 'basic'){
    basicModel(name);
  }else if (action=='write'&& data != undefined){
    writeModel(name,data);
  }else if(action='db'){
    await writeModel(name,data);
  }else{
    console.log("Bad syntax");
  }
}
