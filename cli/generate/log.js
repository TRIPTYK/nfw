var colors = require('colors/safe');

exports.error = text => {
  console.log(`${colors.red('x')} ${text}`);
};

exports.warning = text => {
  console.log(`${colors.yellow('-')} ${text}`);
};

exports.success = text => {
  console.log(`${colors.green('v')} ${text}`);
};
