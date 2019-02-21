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
const WriteFile = Util.promisify(FS.writeFile);
const colors = require('colors/safe');
const dbWrite = require('./databaseWrite');
const { countLines , capitalizeEntity , removeEmptyLines , writeToFirstEmptyLine , isImportPresent , lowercaseEntity } = require('./utils');
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
        let [columns,foreignKeys] = await Promise.all([p_columns,p_foreignKeys]);

        return {columns,foreignKeys};
    }else{
        Log.rainbow(dbType + " is not supported by this method yet");
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
*  @param {entity name to lowercase} lowercase
*  @param {entity name with first letter to uppercase} capitalize
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
    else if ( data === 'UNI') return ' unique : true,';
    else return '';
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
exports.writeModel = async (action,dbType) =>{
    let lowercase = lowercaseEntity(action);
    let capitalize  = capitalizeEntity(lowercase);

    let path = `${process.cwd()}/src/api/models/${lowercase}.model.ts`
    let p_file = ReadFile(`${process.cwd()}/cli/generate/templates/modelTemplates/modelHeader.txt`, 'utf-8');
    let p_colTemp = ReadFile(`${process.cwd()}/cli/generate/templates//modelTemplates/modelColumn.txt`, 'utf-8');

    let [file,colTemp] = await Promise.all([p_file,p_colTemp]);

    let data;

    try{
        data = await _getTableInfo(dbType,lowercase);
    }catch(err){
        let option = await inquirer.prompt(options);

        if(option.value === 'create an entity' )  {
          data = await dbWrite.dbParams(lowercase);
        }else if(option.value === 'create a basic model'){
            let modelTemp = await ReadFile(`${process.cwd()}/cli/generate/templates/model.txt`);
            let basicModel = (" " + modelTemp)
              .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
              .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);

            let p_write = WriteFile(path, basicModel).catch(e => {
                Log.error("Failed generating model");
            }).then(() => {
                Log.success("Model created in :" + path);
            });

            await Promise.all([_addToConfig(lowercase,capitalize),p_write]);
        }else process.exit(0);
    }

    if( data != null){
        let { columns , foreignKeys } = data;
        let imports = '';
        var entities='';

        await Promise.all(columns.map(async col =>{
            if(col.Field === "id") return;

            let foreignKey = foreignKeys.find(elem => elem.COLUMN_NAME == col.Field);

            if (foreignKey !== undefined)
            {

              let low = foreignKey.REFERENCED_TABLE_NAME;
              let cap = capitalizeEntity(low);

              let {response} = await inquirer.prompt([
                {
                  type : 'list',
                  name: 'response',
                  message : `A relationship has been detected with table ${foreignKey.REFERENCED_TABLE_NAME} with the key ${lowercase}.${col.Field} to ${foreignKey.REFERENCED_TABLE_NAME}.${foreignKey.REFERENCED_COLUMN_NAME}\nWhat kind of relationship is this ?`,
                  choices : ['OneToOne','ManyToMany','ManyToOne','OneToMany']
                },
              ]);

              let relationType = cap;

              if(response == 'OneToMany' || response == 'ManyToMany') relationType = `${cap}[]`;

              let relationTemplate = `  @${response}(type => ${cap},${low} => ${low}.${foreignKey.REFERENCED_COLUMN_NAME})\n  @JoinColumn({ name: '${col.Field}' , referencedColumnName: '${foreignKey.REFERENCED_COLUMN_NAME}' })\n  ${col.Field} : ${relationType};`;

              entities += relationTemplate;
              imports += `import {${cap}} from './${low}.model';\n`;

            }else{
              let entitiesTemp = colTemp
                .replace(/{{ROW_NAME}}/ig, col.Field)
                .replace(/{{ROW_DEFAULT}}/ig, col.Default)
                .replace(/{{ROW_LENGHT}}/ig, _getLength(col.Type))
                .replace(/{{ROW_NULL}}/ig, _getNull(col.Null))
                .replace(/{{ROW_CONSTRAINT}}/ig, _getKey(col.Key))
                .replace(/{{ROW_TYPE}}/ig, _dataWithoutLenght(col.Type));
              entities += ` ${removeEmptyLines(entitiesTemp)} \n\n`;
            }
        }));

        let output = file
          .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
          .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize)
          .replace(/{{FOREIGN_IMPORTS}}/ig,imports)
          .replace(/{{ENTITIES}}/ig, entities);

        await Promise.all([WriteFile(path, output),_addToConfig(lowercase,capitalize)]);
        Log.success("Model created in :" + path);
    }
}
