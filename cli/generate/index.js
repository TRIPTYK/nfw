const FS = require('fs');
const Util = require('util');
const { items } = require('./resources');
const Log = require('./log');
const { countLines , capitalizeEntity } = require('./utils');
const ReadFile = Util.promisify(FS.readFile);
const Exists = Util.promisify(FS.exists);
const readline = require('readline');
var colors = require('colors/safe');
const modelWrite = require('./modelWrite');
const argv = require('yargs').argv;

const crudOptions = {
  create: false,
  read: false,
  update: false,
  delete: false
};

const action = process.argv[2];
const processPath = process.cwd();

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
 * @param  {String} arg
 * @description Check if the @arg contains crud then set the crudOptions
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

if(!argv.operations){
  Log.rainbow('Warning : ','No CRUD options, set every option to true by default');
  crudOptions.create = true;
  crudOptions.update = true;
  crudOptions.read = true;
  crudOptions.delete = true;
}else{
  _checkForCrud(argv.operations);
}

const _writeRoutes = async () => {
  // Write in proxy router
  let proxyPath = `${processPath}/src/api/routes/v1/index.ts`;
  let lines = await countLines(proxyPath);
  let proxy = await ReadFile(proxyPath, 'utf-8');
  let proxyLines = proxy.split('\n');
  let toRoute = `router.use('/${lowercase}s/', ${capitalize}Router);`;
  let toImport = `import { router as ${capitalize}Router } from "./${lowercase}.route";`;
  let isAlreadyImported = false;
  let firstn = false;
  let output = '';

  for(let j = 0 ; j < proxyLines.length ; j++)
  {
    if(proxyLines[j] === toImport) {
      isAlreadyImported = true;
    }

    if(!firstn && proxyLines[j].trim() === '') {
      output += toImport + "\n\n";
      firstn = true;
    }
    else if(j === lines) {
      output += '\n';
      output += '/**\n';
      output += ' * ' + capitalize + ' routes \n';
      output += ' */\n';
      output += toRoute + "\n\n";
    }
    else if(proxyLines[j].trim() === '') { output += "\n"; }
    else { output += proxyLines[j] + "\n" }
  }

  if(!isAlreadyImported)
  {
    FS.writeFile(proxyPath, output, (err) => {
      if(err) {
        console.log(err.message);
        console.log('Original router file will be restored ...');
        FS.writeFile(proxyPath, proxy, (err) => {
          if(err) process.stdout.write(err.message);
          Log.success(`Original router file restoring done.`);
          Log.success(`Files generating done.`);
          Log.warning(`Check the api/routes/v1/index.ts to update`);
          //process.exit(0);
        });
      }else{
        Log.success(`Proxy router file updated.`);
        Log.success(`Files generating done.`);
        Log.info(`Don\'t forget to update the api/models/${lowercase}.model.ts`);
        Log.info(`Don\'t forget to update the api/serializers/${lowercase}.serializer.ts`);
        //process.exit(0);
      }
    });
  }else{
    Log.info(`Proxy router already contains routes for this entity : routes/v1/index.ts generating ignored.`);
    Log.success(`Files generating done.`);
    Log.info(`Don\'t forget to update the api/models/${lowercase}.model.ts`);
    Log.info(`Don\'t forget to update the api/serializers/${lowercase}.serializer.ts`);
    //process.exit(0);
  }
};

/**
 * @description replace the vars in placeholder in file and creates them
 * @param {*} items
 */
const _write = async items => {

  items.forEach( async (item) => {
    let file = await ReadFile(`${processPath}/cli/generate/templates/${item.template}.txt`, 'utf-8');

    // replacing entity names
    let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);    // ig -> global , case insensitive replacement

    // replacing all the placeholder depending on the crud options
    if (crudOptions.create) {
      output = output
        .replace(/{{ENTITY_CRUD_CREATE_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_CREATE_END}}/ig,"");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_CREATE_START}}/ig, "/*")
        .replace(/{{ENTITY_CRUD_CREATE_END}}/ig,"*/");
    }

    if (crudOptions.read) {
      output = output
        .replace(/{{ENTITY_CRUD_READ_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_READ_END}}/ig,"")
        .replace(/{{ENTITY_CRUD_READ_ID_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_READ_ID_END}}/ig,"");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_READ_START}}/ig, "/*")
        .replace(/{{ENTITY_CRUD_READ_END}}/ig,"*/")
        .replace(/{{ENTITY_CRUD_READ_ID_START}}/ig,"/*")
        .replace(/{{ENTITY_CRUD_READ_ID_END}}/ig,"*/");
    }

    if (crudOptions.update){
      output = output
        .replace(/{{ENTITY_CRUD_UPDATE_PUT_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_UPDATE_PUT_END}}/ig,"")
        .replace(/{{ENTITY_CRUD_UPDATE_PATCH_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_UPDATE_PATCH_END}}/ig,"");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_UPDATE_PUT_START}}/ig, "/*")
        .replace(/{{ENTITY_CRUD_UPDATE_PUT_END}}/ig,"*/")
        .replace(/{{ENTITY_CRUD_UPDATE_PATCH_START}}/ig,"/*")
        .replace(/{{ENTITY_CRUD_UPDATE_PATCH_END}}/ig,"*/");
    }

    if (crudOptions.delete) {
      output = output
        .replace(/{{ENTITY_CRUD_DELETE_START}}/ig, "")
        .replace(/{{ENTITY_CRUD_DELETE_END}}/ig,"");
    }else{
      output = output
        .replace(/{{ENTITY_CRUD_DELETE_START}}/ig, "/*")
        .replace(/{{ENTITY_CRUD_DELETE_END}}/ig,"*/");
    }

    FS.writeFile(`${processPath}/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`, output, (err) => {
      if(err) {
        Log.error(`Error while ${item.template} file generating \n`);
        Log.warning(`Check the api/${item.dest}/${lowercase}.${item.template}.${item.ext} to update`);
      }
      else Log.success(`${capitalizeEntity(item.template)} generated.`);
    });
  });

  _writeRoutes();
};

/**
 * Main function
 * Check entity existence, and write file or not according to the context
 *
 * @param {*} items
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
        //_write(items);
        modelWrite.writeModel(lowercase,"sql");
      }

      rl.close();
    });
  }
  else {
    //_write(items);
    modelWrite.writeModel(lowercase,"sql")
  }
};

build(items);
