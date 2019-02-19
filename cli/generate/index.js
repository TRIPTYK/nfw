/**
 * Requirement of the library FS
 * @description Handle read/write stream I/O
 */
const FS = require('fs');
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
const { countLines , capitalizeEntity  } = require('./utils');
/**
 * Transform a async method to a promise
 * @returns {Promise} returns FS.exists async function as a promise
 */
const ReadFile = Util.promisify(FS.readFile);
const WriteFile = Util.promisify(FS.writeFile);
const Exists = Util.promisify(FS.exists);
/**
 * Requirement of the library readline
 */
const readline = require('readline');
/**
 * Requirement of the modelWrite module
 */
const routerWrite = require('./routerWrite');
/**
 * Requirement of the modelWrite library
 */
const modelWrite = require('./modelWrite');
/**
 * Requirement of the library yargs
 * @description Handle the cli args
 */
const argv = require('yargs').argv;

const crudOptions = {
  create: false,
  read: false,
  update: false,
  delete: false
};

const action = process.argv[2];
const processPath = process.cwd();
const operations = process.argv[3];

/**
 *  @description : Checks if the second parameter is present , otherwise exit
 */
if(!action)
{
  Log.error('Nothing to generate. Please, get entity name parameter.');
  process.exit(0);
}

// first letter of the entity to Uppercase
let capitalize  = capitalizeEntity(action);
let lowercase   = action;

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

if(!operations){
  Log.rainbow('Warning : ','No CRUD options, set every option to true by default');
  crudOptions.create = true;
  crudOptions.update = true;
  crudOptions.read = true;
  crudOptions.delete = true;
}else{
  _checkForCrud(operations);
}

/**
 * @description generate an array of fake data to be send for given entity
 * @param {*} items
 */
const _getTestFields = (columns) => {
  return columns.map(elem => {
    let elemLength = new RegExp("\\w\*\\\(\(\[0\-9\]\*\)\\\)","").exec(elem.Type);
    let realType = new RegExp("(\\w*)","").exec(elem.Type)[1];
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
  /*
  console.log(await modelWrite.getTableInfo("sql","refresh_token"));
  process.exit(0);
  */
  try {
    tableColumns = (await modelWrite.getTableInfo("sql",lowercase)).columns;
  }catch(err) {
    tableColumns = [];
  };



  // remove id key from array
  tableColumns.splice(tableColumns.findIndex(el => el.Field == 'id'),1);

  const columnNames = tableColumns.map(elem => `'${elem.Field}'`);
  const validation = _getValidationFields(tableColumns);
  const testColumns = _getTestFields(tableColumns);

  items.forEach( async (item) => {
    let file = await ReadFile(`${processPath}/cli/generate/templates/${item.template}.txt`, 'utf-8');

    // handle model template separately
    if (item.template == 'model') {
      modelWrite.writeModel(lowercase,"sql");
      return;
    }

    // replacing entity names
    let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize) // ig -> global , case insensitive replacement
      .replace(/{{ENTITY_COLUMNS}}/ig,columnNames.join(',\n'))
      .replace(/{{ENTITY_PROPERTIES}}/ig, `{${testColumns.join(',\n')}}`);

    // replacing all the placeholder depending on the crud options
    if (crudOptions.create) {
      output = output
        .replace(/{{ENTITY_CRUD_CREATE_START}}/ig, "")
        .replace(/{{ENTITY_CREATE_VALIDATION}}/ig,validation.join(',\n'))
        .replace(/{{ENTITY_CRUD_CREATE_END}}/ig,"");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_CREATE_START}}[\s\S]*{{ENTITY_CRUD_CREATE_END}}/mg,"");
    }

    if (crudOptions.read) {
      output = output
        .replace(/{{ENTITY_CRUD_READ_START}}|{{ENTITY_CRUD_READ_END}}/ig, "")
        .replace(/{{ENTITY_CRUD_READ_ID_START}}|{{ENTITY_CRUD_READ_ID_END}}/ig, "");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_READ_START}}[\s\S]*{{ENTITY_CRUD_READ_END}}/mg, "")
        .replace(/{{ENTITY_CRUD_READ_ID_START}}[\s\S]*{{ENTITY_CRUD_READ_ID_END}}/mg,"");
    }

    if (crudOptions.update){
      output = output
        .replace(/{{ENTITY_CRUD_UPDATE_PUT_START}}|{{ENTITY_CRUD_UPDATE_PUT_END}}/ig, "")
        .replace(/({{ENTITY_PUT_VALIDATION}}|{{ENTITY_PATCH_VALIDATION}})/ig,validation.join(',\n'))
        .replace(/{{ENTITY_CRUD_UPDATE_PATCH_START}}|{{ENTITY_CRUD_UPDATE_PATCH_END}}/ig, "");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_UPDATE_PUT_START}}[\s\S]*{{ENTITY_CRUD_UPDATE_PUT_END}}/mg, "")
        .replace(/{{ENTITY_CRUD_UPDATE_PATCH_START}}[\s\S]*{{ENTITY_CRUD_UPDATE_PATCH_END}}/mg,"");
    }

    if (crudOptions.delete) {
      output = output
        .replace(/{{ENTITY_CRUD_DELETE_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_DELETE_END}}/ig,"");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_DELETE_START}}[\s\S]*{{ENTITY_CRUD_DELETE_END}}/mg, "");
    }

    FS.writeFile(`${processPath}/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`, output , (err) => {
      if(err) {
        Log.error(`Error while ${item.template} file generating \n`);
        Log.warning(`Check the api/${item.dest}/${lowercase}.${item.template}.${item.ext} to update`);
      }
      else Log.success(`${capitalizeEntity(item.template)} generated.`);
    });
  });

  routerWrite();
};

/**
 * Main function
 * Check entity existence, and write file or not according to the context
 *
 * @param {Array.<JSON>} items
 */
const build = async (items) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let entityExists = await Exists(`${process.cwd()}/src/api/models/${lowercase}.model.ts`);

  if(entityExists)
  {
    rl.question('An entity with the same name already exists, will you overwrite it ? (y/n)', answer => {
      if (!['y','yes'].includes(answer.toLowerCase().trim())) {
        Log.error(`Process aborted.`);
        process.exit(0);
      }else{
        _write(items);
      }

      rl.close();
    });
  }
  else {
    _write(items);
  }
};

build(items);
