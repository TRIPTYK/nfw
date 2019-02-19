const FS = require('fs');
const Log = require('./log');
const Util = require('util');
const { countLines , capitalizeEntity } = require('./utils');
const ReadFile = Util.promisify(FS.readFile);
const WriteFile = Util.promisify(FS.writeFile);
const Exists = Util.promisify(FS.exists);

// command line and process args
const action = process.argv[2];
const processPath = process.cwd();
const operations = process.argv[3];

// first letter of the entity to Uppercase
let capitalize  = capitalizeEntity(action);
let lowercase   = action;

/**
 * @access private
 * @async
 * @description Read all template and replace {{****}} with variables then write them in their specified path
 */
module.exports = async () => {
  // Write in proxy router
  let proxyPath = `${process.cwd()}/src/api/routes/v1/index.ts`;
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
    else if(proxyLines[j].trim() === '') { output += "\n"; }
    else { output += proxyLines[j] + "\n" }
  }

  // inserts route BEFORE the export statement , eliminaing some false-positive
  let route = '\n\n';
  route += '/**\n';
  route += ' * ' + capitalize + ' routes \n';
  route += ' */\n';
  route += toRoute + "\n\n";
  output = output.replace(/^\s*(?=.*export.*)/m,route); //regex positive lookbehind


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
        });
      }else{
        Log.success(`Proxy router file updated.`);
        Log.success(`Files generating done.`);
      }
    });
  }else{
    Log.info(`Proxy router already contains routes for this entity : routes/v1/index.ts generating ignored.`);
    Log.success(`Files generating done.`);
  }
};
