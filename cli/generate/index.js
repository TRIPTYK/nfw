/**
 *
 */
const FS = require('fs');
const Util = require('util');
const { items } = require('./resources');
const { countLines } = require('./utils');
const ReadFile = Util.promisify(FS.readFile);
const Exists = Util.promisify(FS.exists);
var colors = require('colors/safe');
const crudOptions = {
  create: false,
  read: false,
  update: false,
  delete: false
}

/**
 * @param  {String} arg
 */
const checkForCrud = (arg) => {
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
}


/**
 *  @description : Checks if the second parameter is present , otherwise exit
 *  Exemple :npm run generate User
 *               [0]    [1]   [2]
 */
if(!process.argv[2])
{
  console.log(colors.red('x') + ' ' + 'Nothing to generate. Please, get entity name parameter.')
  process.exit(0);
}


if(!process.argv[3]){
  console.log(colors.rainbow('Warning :') + ' ' +' No CRUD options, set every option to true by default');
  crudOptions.create = true;
  crudOptions.update = true;
  crudOptions.read = true;
  crudOptions.delete = true;
  console.log(crudOptions)
}else{
  var crud = checkForCrud(process.argv[3])
  console.log(crud);
  //process.exit(0);
}


// first letter of the entity to Uppercase
let capitalize  = process.argv[2][0].toUpperCase() + process.argv[2].substr(1);
let lowercase   = process.argv[2];

/**
 * @description replace the vars in {{}} format in file and creates them
 * @param {*} items
 */
const _write = async (items) => {

  items.forEach( async (item) => {
    let file = await ReadFile(`${process.cwd()}/cli/generate/templates/${item.template}.txt`, 'utf-8');
    let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);    // ig -> global , case insensitive replacement
    if(crudOptions.create) output = output.replace(/{{ENTITY_CRUD_CREATE_START}}/ig, "").replace(/{{ENTITY_CRUD_CREATE_END}}/ig,"");
    else output = output.replace(/{{ENTITY_CRUD_CREATE_START}}/ig, "/*").replace(/{{ENTITY_CRUD_CREATE_END}}/ig,"*/");

    if(crudOptions.read){
      output = output.replace(/{{ENTITY_CRUD_READ_START}}/ig, "")
      .replace(/{{ENTITY_CRUD_READ_END}}/ig,"")
      .replace(/{{ENTITY_CRUD_READ_ID_START}}/ig, "")
      .replace(/{{ENTITY_CRUD_READ_ID_END}}/ig,"");
    }else {
      output = output.replace(/{{ENTITY_CRUD_READ_START}}/ig, "/*")
      .replace(/{{ENTITY_CRUD_READ_END}}/ig,"*/")
      .replace(/{{ENTITY_CRUD_READ_ID_START}}/ig,"/*")
      .replace(/{{ENTITY_CRUD_READ_ID_END}}/ig,"*/");
    }
    if(crudOptions.update){
      output = output.replace(/{{ENTITY_CRUD_UPDATE_PUT_START}}/ig, "")
      .replace(/{{ENTITY_CRUD_UPDATE_PUT_END}}/ig,"")
      .replace(/{{ENTITY_CRUD_UPDATE_PATCH_START}}/ig, "")
      .replace(/{{ENTITY_CRUD_UPDATE_PATCH_END}}/ig,"");
    }else {
      output = output.replace(/{{ENTITY_CRUD_UPDATE_PUT_START}}/ig, "/*")
      .replace(/{{ENTITY_CRUD_UPDATE_PUT_END}}/ig,"*/")
      .replace(/{{ENTITY_CRUD_UPDATE_PATCH_START}}/ig,"/*")
      .replace(/{{ENTITY_CRUD_UPDATE_PATCH_END}}/ig,"*/");
    }

    if(crudOptions.delete) output = output.replace(/{{ENTITY_CRUD_DELETE_START}}/ig, "").replace(/{{ENTITY_CRUD_DELETE_END}}/ig,"");
    else output = output.replace(/{{ENTITY_CRUD_DELETE_START}}/ig, "/*").replace(/{{ENTITY_CRUD_DELETE_END}}/ig,"*/");

    FS.writeFile(`${process.cwd()}/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`, output, (err) => {
      if(err) {
        console.log(`${colors.red('x')} Error while ${item.template} file generating \n`);
        console.log(`${colors.red('WARNING')} : check the api/${items.dest}/${lowercase}.${item.template}.${item.ext} to update`);
      }
      else console.log(`${colors.green('v')} ${item.template[0].toUpperCase()}${item.template.substr(1)} generated.`)
    });
  });

  // Write in proxy router
  let proxyPath = `${process.cwd()}/src/api/routes/v1/index.ts`;
  let lines = await countLines(proxyPath);
  let proxy = await ReadFile(proxyPath, 'utf-8');
  let proxyLines = proxy.split('\n');
  let toRoute = `router.use('/${lowercase}s/', ${capitalize}Router)`;
  let toImport = `import { router as ${capitalize}Router } from "./${lowercase}.route";`;
  let isAlreadyImported = false;
  let firstn = false;
  let output = '';
  let j = 0;

  for(j ; j < proxyLines.length ; j++)
  {
    if(proxyLines[j] === toImport) {
      isAlreadyImported = true;
    }

    if(!firstn && proxyLines[j] === '') {
      output += toImport + "\n\n";
      firstn = true;
    }
    else if(j === lines - 1) {
      output += '\n';
      output += '/**\n';
      output += ' * ' + capitalize + ' routes \n';
      output += ' */\n';
      output += toRoute + "\n\n";
    }
    else if(proxyLines[j] === '') { output += "\n"; }
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
          console.log(`${colors.green('v')} Original router file restoring done.`);
          console.log(`${colors.green('v')} Files generating done.`);
          console.log(`${colors.red('WARNING')} : check the api/routes/v1/index.ts to update`);
          process.exit(0);
        });
      }
      else {
        console.log(`${colors.green('v')} Proxy router file updated.`);
        console.log(`${colors.green('v')} Files generating done.`);
        console.log(`${colors.blue('NOTICE')} : don\'t forget to update the api/models/${lowercase}.model.ts`);
        console.log(`${colors.blue('NOTICE')} : don\'t forget to update the api/serializers/${lowercase}.serializer.ts`);
        process.exit(0);
      }
    });
  }
  else
  {
    console.log(`${colors.blue('i')} Proxy router already contains routes for this entity : routes/v1/index.ts generating ignored.`);
    console.log(`${colors.green('v')} Files generating done.`);
    console.log(`${colors.blue('NOTICE')} : don\'t forget to update the api/models/${lowercase}.model.ts`);
    console.log(`${colors.blue('NOTICE')} : don\'t forget to update the api/serializers/${lowercase}.serializer.ts`);
    process.exit(0);
  }

};

/**
 * Main function
 * Check entity existence, and write file or not according to the context
 *
 * @param {*} items
 */
const build = async (items) => {

  let entityExists = await Exists(`${process.cwd()}/src/api/models/${lowercase}.model.ts`);

  if(entityExists)
  {
    console.log('An entity with the same name already exists, will you overwrite it ? (y/n)');
    process.stdin.on('data', function(data) {
      let value = data.toString().toLowerCase().replace(/\n/i, '').replace(/\r/i, '');  // i -> case insensitive
      if(value !== 'y' && value !== 'yes' ) {
        console.log(`${colors.red('x')} Process aborted.`);
        process.exit(0);
      }
      else {
        _write(items)
      }
    });
  }
  else {
    _write(items);
  }
};

build(items);
