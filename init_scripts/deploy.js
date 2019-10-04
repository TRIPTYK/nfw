const spawn = require('cross-spawn');
const exec = require('child_process').execSync;

const [,,env] = process.argv;

if (!env) {
    console.log("Please use an env");
    return;
}

console.log("Compiling...");
spawn.sync(`./node_modules/.bin/tsc`, [], { stdio: 'inherit' });
console.log("Compiling done");

console.log("Starting server...");
exec(`./node_modules/.bin/pm2 startOrRestart ecosystem.config.js --env ${env}`);
console.log("Started");