/**
 * import modules
 */
const FS = require('fs');
const Log = require('./log');
const Util = require('util');
const { countLines , capitalizeEntity , lowercaseEntity , isImportPresent , writeToFirstEmptyLine } = require('./utils');
const ReadFile = Util.promisify(FS.readFile);
const WriteFile = Util.promisify(FS.writeFile);
const Exists = Util.promisify(FS.exists);

const processPath = process.cwd();

// global properties
var lowercase;
var capitalize;

/**
 * @access private
 * @async
 * @description Read all template and replace {{****}} with variables then write them in their specified path
 */
module.exports = async (action) => {
  capitalize  = capitalizeEntity(action);
  lowercase   = lowercaseEntity(action);

  let proxyPath = `${processPath}/src/api/routes/v1/index.ts`;

  let p_lines = countLines(proxyPath);
  let p_proxy = ReadFile(proxyPath, 'utf-8');
  let [lines,proxy] = await  Promise.all([p_lines,p_proxy]); //wait for countlines and read to finish

  let proxyLines = proxy.split('\n');

  let route = '\n\n';
  route += '/**\n';
  route += ' * ' + capitalize + ' routes \n';
  route += ' */\n';
  route += `router.use('/${lowercase}s/', ${capitalize}Router);\n\n`;

  let output = writeToFirstEmptyLine(proxy,`import { router as ${capitalize}Router } from "./${lowercase}.route";`)
    .replace(/^\s*(?=.*export.*)/m,route); // inserts route BEFORE the export statement , eliminaing some false-positive

  if(!isImportPresent(proxy))
  {
    try {
    await WriteFile(proxyPath,output)
      .then(() => {
        Log.success(`Proxy router file updated.`);
        Log.success(`Files generating done.`);
      });
    }catch(e){ // try-catch block needed , otherwise we will need to launch an async function in catch()
      console.log(e.message);
      console.log('Original router file will be restored ...');
      await WriteFile(proxyPath, proxy)
        .catch(e => {
          process.stdout.write(e.message);
        });
      Log.success(`Original router file restoring done.`);
      Log.success(`Files generating done.`);
      Log.warning(`Check the api/routes/v1/index.ts to update`);
    }
  }else{
    Log.info(`Proxy router already contains routes for this entity : routes/v1/index.ts generating ignored.`);
    Log.success(`Files generating done.`);
  }
};
