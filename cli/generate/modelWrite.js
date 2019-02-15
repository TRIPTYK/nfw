const sqlAdaptator = require('./database/sqlAdaptator');
//const mongoAdaptator = require('./database/mongoAdaptator');
const Util = require('util');
const Log = require('./log');
const FS = require('fs');
const ReadFile = Util.promisify(FS.readFile);
const Exists = Util.promisify(FS.exists);
var colors = require('colors/safe');

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

const dataWithoutLenght= (data) =>{
    type = data.split('(')
    return `"${type[0]}"`;
}

const haveLenght = (data) =>{
    type = data.split('(');

    if(type[0] === "enum"){
        let better = type[1].replace(')',"") ;
        return "enum  : ["+better+"],";
    }
    if(type[1] != null){
        let better = type[1].replace(')',"") ;
        return "length : "+better+",";
    }else{
        return '';
    }
}

exports.getTableInfo = getTableInfo;

const dateDefaultIsNow = (data,def) =>{
    type = data.split('(');
    if(type[0] === "datetime" && def != null){
        return "DateUtils.mixedDateToDateString( new Date() )"
    }else {
        return def
    }
}

exports.writeModel = async (table,dbType) =>{
    let capitalize  = table[0].toUpperCase() + table.substr(1);
    let lowercase   = table[0].toLowerCase() + table.substr(1);
    let path = `${process.cwd()}/src/api/models/${lowercase}.model.ts`
    let file = await ReadFile(`${process.cwd()}/cli/generate/templates/modelHeader.txt`, 'utf-8');
    let ColTemp = await ReadFile(`${process.cwd()}/cli/generate/templates/modelColumn.txt`, 'utf-8');
    data = await getTableInfo(dbType,table);
    console.log(data);
    console.log(data[0].Field);
    var Entities='';
    await data.forEach(async col =>{
        if(col.Field === "id"){
            return;
        }
        let EntitiesTemp = ColTemp
        .replace(/{{ROW_NAME}}/ig, col.Field)
        .replace(/{{ROW_DEFAULT}}/ig, dateDefaultIsNow(col.Type,col.Default))
        .replace(/{{ROW_LENGHT}}/ig, haveLenght(col.Type))
        .replace(/{{ROW_TYPE}}/ig, dataWithoutLenght(col.Type));
        console.log(haveLenght(col.Type));
        Entities += " "+EntitiesTemp +"\n\n" ;
    });
    let output = file
    .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
    .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize)
    .replace(/{{ENTITIES}}/ig, Entities);
    console.log(output);
    FS.writeFile(path, output, (err) => {
    console.log(colors.green("Model created in :"+path));
    Log.info("Dont forget to update your /src/config/typeorm.config.ts entities");
    });


}
