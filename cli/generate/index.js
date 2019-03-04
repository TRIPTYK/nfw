/**
 * Requirement of the library FS
 * @description Handle read/write stream I/O
 */
const FS = require('fs');
const ejs = require('ejs');
/**
 * Requirement of the library Utils
 * @description Needed to promisify async methods
 */
const Util = require('util');
/**
 * Get the informations about the templates generation
 * @returns {Array.<JSON>} Return an array of json object
 */
const { items } = require('./resources');
/**
 * Requirement of the logs library
 *@description Define function to simplify console logging
 */
const Log = require('./log');
/**
 * Requirement of the functions "countLine" and "capitalizeEntity" from the local file utils
 */
const { countLines , capitalizeEntity , prompt , lowercaseEntity , fileExists} = require('./utils');
/**
 * Transform a async method to a promise
 * @returns {Promise} returns FS.exists async function as a promise
 */
const ReadFile = Util.promisify(FS.readFile);
const WriteFile = Util.promisify(FS.writeFile);
/**
 * Requirement of the library readline
 */
const readline = require('readline');
const routerWrite = require('./routerWrite');
const modelWrite = require('./modelWrite');
const databaseInfo = require('./databaseInfo');

const crudOptions = {
  create: false,
  read: false,
  update: false,
  delete: false
};

const processPath = process.cwd();

// false class properties
var capitalize;
var lowercase;

/**
 * @description : Check in a string if the letter C R U D are present and set the boolean of each Crud varable present in crudOption
 * @param  {string} arg - The thirs argument of 'npm run generate stringName {CRUD}'
 * @returns {Array.<boolean>} Return an array of boolean depending on the input string
 */
const _checkForCrud = (arg) => {
  let crudString = arg.toLowerCase();

  if((/^[crud]{1,4}$/).test(crudString)){
      if(crudString.includes('c')) crudOptions.create = true;
      if(crudString.includes('r')) crudOptions.read = true;
      if(crudString.includes('u')) crudOptions.update = true;
      if(crudString.includes('d')) crudOptions.delete = true;
  }
  else{
    return false;
  }
  return crudOptions;
};

/**
 * @description generate an array of fake data to be send for given entity
 * @param {*} columns
 */
const _getTestFields = (columns) => {
  return columns.map(elem => {
    let elemLength = elem.Type.length;
    let realType = elem.Type.type;
    elemLength = elemLength === null ? elemLength = null : elemLength[1];

    let elemVal = `fixtures.random${realType}(${elemLength})`;
    return `${elem.Field} : ${elemVal}`;
  });
};

/**
 * @description generate an array of validation properties for entity
 * @param {*} items
 */
const _getValidationFields = (columns) => {
  return columns.map(elem => {
    let elemLength = new RegExp("\\w\*\\\(\(\[0\-9\]\*\)\\\)","").exec(elem.Type);
    let realType = new RegExp("(\\w*)","").exec(elem.Type)[1];
    elemLength = elemLength === null ? elemLength : elemLength[1];

    if (realType.match(/(char|text)+/i)) realType = 'string';
    if (realType.match(/(date|time)+/i)) realType = 'date';
    if (realType.match(/(int)+/i)) realType = 'number';

    let elemVal = `Joi.${realType}()${elemLength === null ? '' : `.max(${elemLength})`}`;
    return `${elem.Field} : ${elemVal}`;
  });
};

/**
 * @description replace the vars in placeholder in file and creates them
 * @param {*} items
 */
const _write = async items => {
  let tableColumns;

  try {
    tableColumns = (await databaseInfo.getTableInfo("sql",lowercase)).columns;
  }catch(err) {
    tableColumns = [];
  };

  // remove id key from array
  tableColumns.splice(tableColumns.findIndex(el => el.Field == 'id'),1);

  const columnNames = tableColumns.map(elem => `'${elem.Field}'`);
  const validation = _getValidationFields(tableColumns);
  const testColumns = _getTestFields(tableColumns);

  let promises = items.map( async (item) => {
    // handle model template separately
    if (item.template == 'model') return;

    let file = await ReadFile(`${processPath}/cli/generate/templates/${item.template}.ejs`, 'utf-8');

    let output = ejs.compile(file)({
      entityLowercase : lowercase,
      entityCapitalize : capitalize,
      options : crudOptions,
      entityColumns : columnNames,
      entityProperties : `{${testColumns.join(',\n')}}`,
      validation : validation.join(',\n')
    });

    await WriteFile(`${processPath}/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`, output)
      .then(() => {
        Log.success(`${capitalizeEntity(item.template)} generated.`)
      })
      .catch(e => {
        Log.error(`Error while ${item.template} file generating \n`);
        Log.warning(`Check the api/${item.dest}/${lowercase}.${item.template}.${item.ext} to update`);
      });
    });

    promises.push(routerWrite(lowercase)); // add the router write promise to the queue
    await Promise.all(promises); // wait for all async to finish
};

/**
 * Main function
 * Check entity existence, and write file or not according to the context
 *
 * @param {Array.<JSON>} items
 */
const build = async (modelName, crudArgs) => {
  if(!modelName.length)
  {
    Log.error('Nothing to generate. Please, get entity name parameter.');
    return;
  }

  if(!crudArgs.length){
    Log.rainbow('Warning : ','No CRUD options, set every option to true by default');
    crudOptions.create = true;
    crudOptions.update = true;
    crudOptions.read = true;
    crudOptions.delete = true;
  }else{
    if(!_checkForCrud(crudArgs)){
      Log.error('Error : Wrong CRUD arguments');
      return;
    }
  }

  // assign false class properties
  lowercase = lowercaseEntity(modelName);
  capitalize = capitalizeEntity(modelName);

  await _write(items);

  Log.success('Generating task done');
};


module.exports = build;
