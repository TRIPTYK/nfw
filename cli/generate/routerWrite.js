/**
 * import modules
 */
const FS = require('fs');
const Log = require('./log');
const Util = require('util');
const ejs = require('ejs');
const { countLines , capitalizeEntity , lowercaseEntity , isImportPresent , writeToFirstEmptyLine } = require('./utils');
const ReadFile = Util.promisify(FS.readFile);
const WriteFile = Util.promisify(FS.writeFile);

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
  let routeUsePath = `${processPath}/cli/generate/templates/route/routerUse.ejs`;

  let p_lines = countLines(proxyPath);
  let p_proxy = ReadFile(proxyPath,'utf-8');
  let p_route = ReadFile(routeUsePath, 'utf-8');
  let [lines,proxy,route] = await Promise.all([p_lines,p_proxy,p_route]); //wait for countlines and read to finish

  route = ejs.compile(route)({
    entityLowercase : lowercase,
    entityCapitalize : capitalize
  });

  if(!isImportPresent(proxy,capitalize))
  {
    let output = writeToFirstEmptyLine(proxy,`import { router as ${capitalize}Router } from "./${lowercase}.route";\n`)
      .replace(/^\s*(?=.*export.*)/m,`\n\n${route}\n\n`); // inserts route BEFORE the export statement , eliminaing some false-positive

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
        .catch(e => Log.error(e.message));
      Log.success(`Original router file restoring done.`);
      Log.success(`Files generating done.`);
      Log.warning(`Check the api/routes/v1/index.ts to update`);
    }
  }else{
    Log.info(`Proxy router already contains routes for this entity : routes/v1/index.ts generating ignored.`);
    Log.success(`Files generating done.`);
  }
};
