/**
 *
 */

const { items } = require('./resources');
const { countLines } = require('./utils');
const FS = require('fs');
const Log = require('./log');
const Util = require('util');
const Exists = Util.promisify(FS.exists);
const ReadFile = Util.promisify(FS.readFile);
var colors = require('colors/safe');


/**
 *
 */
if(!process.argv[2])
{
  Log.error('Nothing to delete. Please, get entity name parameter.');
  process.exit(0);
}

// first letter of the entity to Uppercase
let capitalize  = process.argv[2][0].toUpperCase() + process.argv[2].substr(1);
let lowercase   = process.argv[2];

const _unlink = async (items) => {
  let currentPath = process.cwd();

  items.forEach( async (item) => {
    let relativeFilePath = `/src/api/${item.dest}/${lowercase}.${item.template}.${item.ext}`;
    let filePath = currentPath + relativeFilePath;
    let exists = await Exists(filePath);
    if (exists) {
      FS.unlink(filePath, (err) => {
        if(err)
          Log.error(`Error while deleting ${item.template} \n`);
        else
          Log.success(`${item.template[0].toUpperCase()}${item.template.substr(1)} deleted.`)
      });
    }else{
      Log.warning(`Cannot delete ${relativeFilePath} : file does not exists`);
    }
  });

  // Write in proxy router
  let proxyPath = `${currentPath}/src/api/routes/v1/index.ts`;
  let proxy = await ReadFile(proxyPath, 'utf-8');

  // this regex will match a use statement and the associated JSDoc comment
  let toRoute = new RegExp(`\n?((\\\/\\*[\\w\\\'\\s\\r\\n\\*]*\\*\\\/)|(\\\/\\\/[\\w\\s\\\']*))\\s*(\\w*.use.*${capitalize}Router(.|\\s){1};)\n?`,"gm");
  // match import statement of current entity
  let importStatement = new RegExp(`\n{0,2}import.*${capitalize}Router.*;\n?`,"g");

  proxy = proxy.replace(toRoute,"");
  proxy = proxy.replace(importStatement,"");

  FS.writeFile(proxyPath, proxy, (err) => {
    if(err) Log.error(`Failed to write to ${proxyPath}`);
    Log.success(`Replaced ${proxyPath}`);
  });
};

_unlink(items);
