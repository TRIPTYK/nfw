/**
 * Require the library FS
 */
const FS = require('fs');
const _ = require('lodash');

/**
 * @description : count the lines of a file
 * @param {*} path
 */
exports.countLines = (path) => {
  let count = 0;
  return new Promise( (resolve, reject) => {
    try {
      FS.createReadStream(path)
        .on('data', function(chunk) {
          let i;
          for (i = 0; i < chunk.length; ++i)
            if (chunk[i] == 10) count++; // 10 -> line ending in ASCII table
        })
        .on('end', function(data) {
          resolve(count); // return promise (https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise/resolve)
        });
    }
    catch(e) {
      reject(e.message);
    }
  });
};

const readline = require('readline');

exports.prompt = (question) => {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  return new Promise((res, rej) => {
      rl.question(question, (answer) => {
          res(answer);
          rl.close();
      });
  });
}

exports.isImportPresent = (string,imprt) => {
  let doesMatch = string.match(new RegExp(`import.*${imprt}.*;`,'')) !== null;
  return doesMatch;
};

exports.removeImport = (string,imprt) => string.replace(new RegExp(`\n?import.*${imprt}.*;`,"g"),"");
exports.writeToFirstEmptyLine = (string,by = "") => string.replace(/^\s*$/m,by);
exports.removeEmptyLines = (string) => string.replace(/\n?^\s*$/gm,"");
exports.capitalizeEntity = (entity) => entity[0].toUpperCase() + entity.substr(1);
