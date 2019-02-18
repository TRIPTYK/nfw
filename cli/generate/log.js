/**
 * @module modelWrite
 * @description shortcut to log colorfull text messages
 */
var colors = require('colors/safe');

exports.error = text => {
  console.log(`${colors.red('x')} ${text}`);
};

exports.warning = text => {
  console.log(`${colors.yellow('!')} ${text}`);
};

exports.success = text => {
  console.log(`${colors.green('v')} ${text}`);
};

exports.rainbow = (preText,text) => {
  console.log(`${colors.rainbow(preText)} ${text}`);
};

exports.info = text => {
  console.log(`${colors.blue('i')} ${text}`);
};
