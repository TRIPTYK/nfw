const res = require('./resources');
const inquirer = require('inquirer');
const colors = require('colors/safe');
const needLength =  ['int','varchar'];
const enumQuestion = [{type:'input',name:'enum', message:'add a value to enum array'}];
const confirmQuestion = [{type:'confirm', name:'confirmation', message:'Add this data ?'}];
const lengthQuestion= [{type:'input',name:'length',message:'what\'s the data length ? ', validate : (value =>{
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
    var paramsArray;
    console.log(colors.red('/!\\ id is added by default ! you can\'t add a column for id '))
    while(!isDone){
        let value = await inquirer.prompt(res.questionsParams);
        if(value.column.toLowerCase() === 'id'){
            console.log(colors.red('/!\\ id is added by default ! you can\'t add a column for id '));   
        }else{
            var length_enum;
            if(needLength.includes(value.type)){
                length_enum = await inquirer.prompt(lengthQuestion);
            }else if(value.type === 'enum'){
                let arrayDone= false;
                while(!arrayDone){
                    let enumTemp = await inquirer.prompt(enumQuestion);
                    let confirm = await inquirer.prompt(confirmQuestion);
                    if(confirm.confirmation){
                        length_enum.push(enumTemp);
                    }
                    let more = await inquirer.prompt([{
                        type : 'confirm' ,
                        name : 'continueValue', 
                        message : "Want to add more column ?", 
                        default: true 
                    }]);
                    if(!more){
                        arrayDone = false ;
                    }
                }
                console.log(length_enum);
            }
            let cont = await inquirer.prompt([{
                type : 'confirm' ,
                name : 'continueValue', 
                message : "Want to add more column ?", 
                default: true 
            }]);
            console.log(value);
            if(!cont.continueValue){
                isDone = true;
            }
        }
    }
    console.log("plop !");
    return paramsArray
}