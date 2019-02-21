/**
 * Requires
 */
const FS = require('fs');
const readline = require('readline');

/**
 * @description : count the lines of a file
 * @param {string} path
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
          resolve(count); // return promise
        });
    }
    catch(e) {
      reject(e.message);
    }
  });
};

/**
 * @description prompt a question and wait for a response
 * @param {string} question the question to ask
 */
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

/**
 * @description check if import is present in string
 * @param {string} string
 * @param {string} imprt import name
 */
exports.isImportPresent = (string,imprt) => (string.match(new RegExp(`import.*${imprt}.*;`,'')) !== null);

/**
 * @description remove import from string
 * @param {string} string
 * @param {string} imprt import name
 */
exports.removeImport = (string,imprt) => string.replace(new RegExp(`\n?import.*${imprt}.*;`,"g"),"");

/**
 * @description replace text to the first empty line of string
 * @param {string} string
 * @param {string} by text to replace by
 */
exports.writeToFirstEmptyLine = (string,by = "") => string.replace(/^\s*$/m,by);

/**
 * @description remove blank lines from text
 * @param {string} string
 */
exports.removeEmptyLines = (string) => string.replace(/\n?^\s*$/gm,"");

/**
 * @description capitalize first letter of String
 * @param {string} entity
 */
exports.capitalizeEntity = (entity) => entity[0].toUpperCase() + entity.substr(1);

/**
 * @description lowercase first letter of string
 * @param {string} entity
 */
exports.lowercaseEntity = (entity) => entity[0].toLowerCase() + entity.substr(1);
