const { items } = require('./resources');
const { countLines , capitalizeEntity , removeImport , isImportPresent , lowercaseEntity , fileExists} = require('./utils');
const FS = require('fs');
const Log = require('./log');
const Util = require('util');
const ReadFile = Util.promisify(FS.readFile);
const Unlink = Util.promisify(FS.unlink);
const WriteFile = Util.promisify(FS.writeFile);
const SqlAdaptator = require('./database/sqlAdaptator');
var colors = require('colors/safe');
const mysqldump = require('mysqldump');

// simulate class properties
var capitalize;
var lowercase;

const processPath = process.cwd();


/**
 * @description delete compiled typescript files , ignoring tests
 */
const _deleteCompiledJS = async() => {
  await Promise.all(items.map( async (item) => {
    if (item.template == 'test') return; // no compiled tests

    let relativeFilePath = `/dist/api/${item.dest}/${lowercase}.${item.template}.js`;
    let filePath = processPath + relativeFilePath;

    if (fileExists(filePath)) {
      await Unlink(filePath)
      .then(() => Log.success(`Compiled ${item.template[0].toUpperCase()}${item.template.substr(1)} deleted.`) )
      .catch(e => Log.error(`Error while deleting compiled ${item.template}`) );
    }else{
      Log.warning(`Cannot delete compiled ${relativeFilePath} : file does not exists`);
    }
  }));
};

/**
 *  @description delete typescript files
 */
const _deleteTypescriptFiles = async() => {
  await Promise.all(items.map( async (item) => {
    let relativeFilePath = `/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`;
    let filePath = processPath + relativeFilePath;

    if (fileExists(filePath)) {
      await Unlink(filePath)
      .then(() => Log.success(`${item.template[0].toUpperCase()}${item.template.substr(1)} deleted.`) )
      .catch(e => Log.error(`Error while deleting ${item.template} \n`) );
    }else{
      Log.warning(`Cannot delete ${relativeFilePath} : file does not exists`);
    }
  }));
};

/**
 * @description Delete route related informations in router index.ts
 */
const _unroute = async () => {
  let proxyPath = `${processPath}/src/api/routes/v1/index.ts`;
  let proxy = await ReadFile(proxyPath, 'utf-8');

  // this regex will match a use statement and the associated JSDoc comment
  let toRoute = new RegExp(`\n?((\\\/\\*[\\w\\\'\\s\\r\\n\\*]*\\*\\\/)|(\\\/\\\/[\\w\\s\\\']*))\\s*(\\w*.use.*${capitalize}Router(.|\\s){1};)\n?`,"gm");

  // replace match by nothing
  proxy = removeImport(proxy,capitalize)
    .replace(toRoute,"");

  await WriteFile(proxyPath, proxy)
    .catch(e => Log.error(`Failed to write to ${proxyPath}`) );
};

/**
 * @description removes Object and import from typeorm config file
 */
const _unconfig = async () => {
  let configFileName = `${process.cwd()}/src/config/typeorm.config.ts`;
  let fileContent = await ReadFile(configFileName, 'utf-8');

  if (isImportPresent(fileContent,capitalize)) {
    let imprt = removeImport(fileContent,capitalize)
      .replace(new RegExp(`(?=,?${capitalize}),${capitalize}|${capitalize},?`,"gm"),"");

    await WriteFile(configFileName,imprt).catch(e => {
      Log.error(`Failed to write to : ${configFileName}`);
    });
  }
};

/**
 * @description module export main entry , it deletes generated files
 * @param {*} items
 */
module.exports = async (action,drop) => {
  //constructor behavior
  capitalize = capitalizeEntity(action);
  lowercase = lowercaseEntity(action);

  let promises = [  // launch all tasks in async
    _deleteTypescriptFiles(),
    _deleteCompiledJS(),
    _unroute(),
    _unconfig(),
  ];

  await Promise.all(promises);

  let dumpPath = `./dist/migration/dump/${+ new Date()}-${action}`;

  if (await SqlAdaptator.tableExists(action) && drop) {
    await SqlAdaptator.dumpTable(action,dumpPath)
      .then(() => Log.success(`SQL dump created at : ${dumpPath}`))
      .catch(e => Log.error("Failed to create table dump"));
    await SqlAdaptator.dropTable(action)
      .then(() => Log.success("Table dropped"))
      .catch(e => Log.error("Failed to delete table"));
  };


  Log.success('Delete task done');
};
