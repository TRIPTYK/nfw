const spawn = require('cross-spawn');

const [,,env] = process.argv;

if (!env) {
    console.log("Please use an env");
    return;
}

console.log("Compiling...");
spawn.sync(`./node_modules/.bin/tsc`, [], { stdio: 'inherit' });
console.log("Compiling done");

spawn.sync(`./node_modules/.bin/pm2 restart ecosystem.config.js --env ${env}`, [], { stdio: 'inherit' });