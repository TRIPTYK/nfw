const { items } = require('./resources');
const { countLines , capitalizeEntity , removeImport} = require('./utils');
const FS = require('fs');
const Log = require('./log');
const Util = require('util');
const Exists = Util.promisify(FS.exists);
const ReadFile = Util.promisify(FS.readFile);
const Unlink = Util.promisify(FS.unlink);
const WriteFile = Util.promisify(FS.writeFile);
var colors = require('colors/safe');

const action = process.argv[2];
const processPath = process.cwd();

if(!action)
{
  Log.error('Nothing to delete. Please, get entity name parameter.');
  process.exit(0);
}

// first letter of the entity to Uppercase
let capitalize  = capitalizeEntity(action);
let lowercase   = action;

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
    .then(() => Log.success(`Replaced ${proxyPath}`) )
    .catch(e => Log.error(`Failed to write to ${proxyPath}`) );
};

/**
 * @description Delete generated files
 * @param {*} items
 */
const _unlink = async (items) => {
  let promises = items.map( async (item) => {
    let relativeFilePath = `/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`;
    let filePath = processPath + relativeFilePath;
    let exists = await Exists(filePath);

    if (exists) {
      await Unlink(filePath)
      .then(() => Log.success(`${item.template[0].toUpperCase()}${item.template.substr(1)} deleted.`) )
      .catch(e => Log.error(`Error while deleting ${item.template} \n`) );
    }else{
      Log.warning(`Cannot delete ${relativeFilePath} : file does not exists`);
    }
  });

  promises.push(_unroute());
  await Promise.all(promises);
  process.exit(0);
};

_unlink(items);
