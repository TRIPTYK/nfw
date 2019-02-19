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
        let confirm = await  inquirer.prompt(createQuestion);
        if (confirm.option === 'create a table') data = await dbWrite.dbParams(table);
        else if (confirm.option === 'generate basic model'){
            let modelTemplate = await ReadFile(`${process.cwd()}/cli/generate/templates/model.txt`);
            let model = (""+modelTemplate)
            .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
            .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);
            FS.writeFile(path, model, (err) => {
                console.log(colors.green("Model created in :"+path));
                Log.info("Dont forget to update your /src/config/typeorm.config.ts entities");
                process.exit(0);
                });
        }
        else process.exit(0)
    }

    let { columns , foreignKeys } = data;

    let entities='';
    let imports='';

    await Promise.all(columns.map(async col =>{
        if(col.Field === "id")
            return;

        let foreignKey = foreignKeys.find(elem => elem.COLUMN_NAME == col.Field);
        if (foreignKey !== undefined)
        {
          let low = foreignKey.REFERENCED_TABLE_NAME.toLowerCase();
          let cap = capitalizeEntity(low);

          let {response} = await inquirer.prompt([
            {type : 'list' ,name: 'response', message : `A relationship has been detected with table ${foreignKey.REFERENCED_TABLE_NAME} with the key ${table}.${col.Field} to ${foreignKey.REFERENCED_TABLE_NAME}.${foreignKey.REFERENCED_COLUMN_NAME}\nWhat kind of relationship is this ?`, choices : ['OneToOne','ManyToMany','ManyToOne','OneToMany']},
          ]);

          let relationType = cap;

          if(response == 'OneToMany' || response == 'ManyToMany') relationType = `${cap}[]`;

          let relationTemplate = `@${response}(type => ${cap},${low} => ${low}.${foreignKey.REFERENCED_COLUMN_NAME})\n@JoinColumn({ name: '${col.Field}' , referencedColumnName: '${foreignKey.REFERENCED_COLUMN_NAME}' })\n${col.Field} : ${relationType};`;

          entities += relationTemplate;
          imports += `import {${cap}} from './${low}.model';\n`;

        }else{
          let entitiesTemp = colTemp
            .replace(/{{ROW_NAME}}/ig, col.Field)
            .replace(/{{ROW_DEFAULT}}/ig, _dateDefaultIsNow(col.Type,col.Default))
            .replace(/{{ROW_LENGHT}}/ig, _getLength(col.Type))
            .replace(/{{ROW_NULL}}/ig, _getUnique(col.Null))
            .replace(/{{ROW_CONSTRAINT}}/ig, _getKey(col.Key))
            .replace(/{{ROW_TYPE}}/ig, _dataWithoutLenght(col.Type));
          entities += ' '+entitiesTemp +"\n\n" ;
        }
    }));

    let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize)
      .replace(/{{ENTITIES}}/ig, removeEmptyLines(entities))
      .replace(/{{FOREIGN_IMPORTS}}/ig,imports);

    FS.writeFile(path, output, (err) => {
      console.log(colors.green("Model created in :"+path));
      Log.info("Dont forget to update your /src/config/typeorm.config.ts entities");
    });
}
