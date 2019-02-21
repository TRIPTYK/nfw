const res = require('./resources');
const inquirer = require('inquirer');
const colors = require('colors/safe');

const needLength =  ['int','varchar','tinyint','smallint','mediumint','bigint','float','double','decimal','char','binary','varbinary'];

const enumQuestion = [
  {
    type:'input',
    name:'enum',
    message:'add a value to enum array : ',
    filter : data => return `'${data}',`;
  }
];

const confirmQuestion = [
  {
    type:'confirm',
    name:'confirmation',
    message:'Add this data ?'
  }
];

const lengthQuestion= [
  {
    type:'input',
    name:'enum',
    message:'what\'s the data length ? ',
    validate : value =>{
      let pass = value.match(/[0-9]+$/);
      return pass ? true : "You must provide a number !";
    }
  }
];

const relation = [
  {
    type:'confirm',
    name:'addRelation',
    message:'do you want to add relation between table ? ',
    default:true
  }
]


/**
 * @author Verliefden romain
 * @description ask the user to configure future column of his table
 * @return an array with the information
 */
exports.dbParams = async (entity) => {
    var isDoneColumn = false;
    var paramsArray = [];
    paramsArray['columns'] = [];
    paramsArray['foreignKeys'] = [];
    var column = [];
    console.log(colors.green(`Let's create a table for ${entity}`));
    console.log(colors.green('/!\\ id is added by default .'));
    while(!isDoneColumn){
        let value = await inquirer.prompt(res.questionsParams);
        if(column.includes(value.column)){
            console.log(colors.red('/!\\ You already added this column !'));
        }else{
            let length_enum = [];
            if(needLength.includes(value.type)){
                length_enum[0] = await inquirer.prompt(lengthQuestion);
            }else if(value.type === 'enum'){
                let arrayDone= false;
                while(!arrayDone){
                    let enumTemp = await inquirer.prompt(enumQuestion);
                    let confirm = await inquirer.prompt(confirmQuestion);
                    if(confirm.confirmation){
                        length_enum[length_enum.length]=enumTemp;
                    }
                    let more = await inquirer.prompt([{
                        type : 'confirm' ,
                        name : 'continueValue',
                        message : "Want to add more data to enum array ?",
                        default: true
                    }]);
                    if(!more.continueValue){
                        arrayDone = true ;
                    }
                }
            }else{
                length_enum[0]='NOTHING TO ADD'
            }
            let tempParanthesis = '';
            if(length_enum[0] !== 'NOTHING TO ADD'){
                tempParanthesis += '('
                length_enum[length_enum.length-1].enum=length_enum[length_enum.length-1].enum.replace(',','');
                length_enum.forEach(elem => {
                    tempParanthesis += elem.enum;
                });
                tempParanthesis += ')'
            }
            if(['text','varchar','enum'].includes(value.type) && value.defaultValue!=='null'){
                value.defaultValue=`'${value.defaultValue}'`;
            }
            let paramsTemp = {
                Field : value.column.trim(),
                Type : value.type.trim()+tempParanthesis.trim(),
                Default : value.defaultValue.trim(),
                Null : value.uniqueValue === true ? 'YES' : 'NO',
                Key : value.constraintValue
            };
            console.clear();
            console.log(paramsTemp);
            let lastConfirm = await inquirer.prompt(confirmQuestion);
            if(value.constraintValue === 'foreign key'){
                let {referencedTable, referencedColumn} = await inquirer.prompt(res.questionRelation);
                let relationTemp = {
                    TABLE_NAME : entity,
                    COLUMN_NAME : value.column,
                    REFERENCED_TABLE_NAME : referencedTable.trim(),
                    REFERENCED_COLUMN_NAME : referencedColumn
                };
                console.log(relationTemp);
                let {confirmation} = await inquirer.prompt(confirmQuestion);
                if(confirmation) paramsArray['foreignKeys'].push(relationTemp);
            }
            if(lastConfirm.confirmation){
                column[column.length] = value.column;
                paramsArray['columns'].push(paramsTemp);
            }
            let cont = await inquirer.prompt([{
                type : 'confirm' ,
                name : 'continueValue',
                message : "Want to add more column ?",
                default: true
            }]);
            if(!cont.continueValue){
                isDoneColumn = true;
            }
        }
    }
    return paramsArray;
}
