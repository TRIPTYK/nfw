const FS = require('fs');
const Util = require('util');
const ReadFile = Util.promisify(FS.readFile);
const Exists = Util.promisify(FS.exists);

if(!process.argv[2])
{
  console.log('Nothing to generate. Please, get entity name parameter.')
  process.exit(0);
}

let capitalize  = process.argv[2][0].toUpperCase() + process.argv[2].substr(1);
let lowercase   = process.argv[2];

let items = [
  { template : 'model', dest: 'models' },
  { template : 'controller', dest: 'controllers' },
  { template : 'repository', dest: 'repositories' },
  { template : 'validation', dest: 'validations' },
  { template : 'route', dest: 'routes/v1' },
];

/**
 * 
 * @param {*} path 
 */
const _countLines = (path) => {
  let count = 0;
  return new Promise( (resolve, reject) => {
    try {
      FS.createReadStream(path)
        .on('data', function(chunk) {
          let i;
          for (i = 0; i < chunk.length; ++i)
            if (chunk[i] == 10) count++;
        })
        .on('end', function(data) {
          resolve(count);
        });
    }
    catch(e) {
      reject(e.message);
    }
  });
}

/**
 * 
 * @param {*} items 
 */
const _write = async (items) => {

  items.forEach( async (item) => {
    let file = await ReadFile(`${process.cwd()}/build/templates/${item.template}.txt`, 'utf-8');
    let output = file
      .replace(/{{ENTITY_LOWERCASE}}/ig, lowercase)
      .replace(/{{ENTITY_CAPITALIZE}}/ig, capitalize);
    FS.writeFile(`${process.cwd()}/src/api/${item.dest}/${lowercase}.${item.template}.ts`, output, (err) => {
      if(err) {
        console.log(`Error while ${item.template} file generating \n`);
        console.log(`WARNING : check the api/${items.dest}/${lowercase}.${item.template}.ts to update`);
      }
      else console.log(`${item.template[0].toUpperCase()}${item.template.substr(1)} generated.`)
    });
  });

  // Write in proxy router 
  let proxyPath = `${process.cwd()}/src/api/routes/v1/index.ts`;
  let lines = await _countLines(proxyPath);
  let proxy = await ReadFile(proxyPath, 'utf-8');
  let array = proxy.split('\n');
  let toRoute = `router.use('/${lowercase}s/', ${capitalize}Router)`;
  let toImport = `import { router as ${capitalize}Router } from "./${lowercase}.route";`;
  let isAlreadyImported = false;
  let firstn = false; 
  let output = '';
  let j = 0;

  for(j ; j < array.length ; j++)
  {
    if(array[j] === toImport) {
      isAlreadyImported = true;
    }

    if(!firstn && array[j] === '') { 
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
    else if(array[j] === '') { output += "\n"; }
    else { output += array[j] + "\n" }
  }

  if(!isAlreadyImported)
  {
    FS.writeFile(proxyPath, output, (err) => {
      if(err) {
        console.log(err.message);
        console.log('Original router file will be restored ...');
        FS.writeFile(proxyPath, proxy, (err) => {
          if(err) process.stdout.write(err.message);
          console.log('Original router file restoring done.');
          console.log('Files generating done.');
          console.log(`WARNING : check the api/routes/v1/index.ts to update`);
          process.exit(0);
        });
      }
      else {
        console.log('Proxy router file updated.')
        console.log('Files generating done.');
        console.log(`NOTICE : don\'t forget to update the api/models/${lowercase}.model.ts`);
        process.exit(0);
      }
    });
  }
  else 
  {
    console.log('Proxy router already contains routes for this entity : routes/v1/index.ts generating ignored.');
    console.log('Files generating done.');
    console.log(`NOTICE : don\'t forget to update the api/models/${lowercase}.model.ts`);
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
      let value = data.toString().toLowerCase().replace(/\n/i, '').replace(/\r/i, '');
      if(value !== 'y' && value !== 'yes' ) {
        console.log('Process aborted.');
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
