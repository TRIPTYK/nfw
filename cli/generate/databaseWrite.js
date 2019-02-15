const res = require('./resources');
const inquirer = require('inquirer');
const colors = require('colors/safe');
const needLength =  ['int','varchar'];
const enumQuestion = [{type:'input',name:'enum', message:'add a value to enum array : ', filter : (data =>{
    return "'"+data+"',";
})}];
const confirmQuestion = [{type:'confirm', name:'confirmation', message:'Add this data ?'}];
const lengthQuestion= [{type:'input',name:'enum',message:'what\'s the data length ? ', validate : (value =>{
    let numberRegex = /[0-9]+$/
    pass = value.match(numberRegex)
    if(pass){
        return true;
    }else{
        return "You must provide a number !";
    }
})}];



exports.dbParams = async (entity) => {
    var isDone = false;
    var paramsArray = [];
    console.log(colors.green(`Let's create a table for ${entity}`));
    console.log(colors.green('/!\\ id is added by default .'));
    while(!isDone){
        let value = await inquirer.prompt(res.questionsParams);
        if(value.column.toLowerCase() === 'id'){
            console.log(colors.red('/!\\ id is added by default ! you can\'t add a column for id '));   
        }else{
            length_enum = [];
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
        }
        let tempParanthesis = ''
        if(length_enum[0] !== 'NOTHING TO ADD'){
            tempParanthesis += '('
            length_enum[length_enum.length-1].enum=length_enum[length_enum.length-1].enum.replace(',','');
            length_enum.forEach(elem => {
                tempParanthesis += elem.enum;    
            });
            tempParanthesis += ')'
        }
        if(['text','varchar'].includes(value.type) && value.defaultValue!=='null'){
            value.defaultValue=`'${value.defaultValue}'`;
        }
        let paramsTemp = {
            Field : value.column,
            Type : value.type+tempParanthesis,
            Default : value.defaultValue
        };
        console.clear();
        console.log(paramsTemp);
        let lastConfirm = await inquirer.prompt(confirmQuestion);
        if(lastConfirm.confirmation){
            paramsArray.push(paramsTemp);
        }
        let cont = await inquirer.prompt([{
            type : 'confirm' ,
            name : 'continueValue', 
            message : "Want to add more column ?", 
            default: true 
        }]);
        if(!cont.continueValue){
            isDone = true;
        }

    }
    console.log(paramsArray);
    return paramsArray
}