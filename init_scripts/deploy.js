const spawn = require('cross-spawn');
const spawnSync = require('child_process').spawnSync;

const [,,env] = process.argv;

if (!env) {
    console.log("Please use an env");
    return;
}

console.log("Compiling...");
spawn.sync(`./node_modules/.bin/tsc`, [], { stdio: 'inherit' });
console.log("Compiling done");

console.log("Starting server...");
spawnSync(`./node_modules/.bin/pm2`, []);
console.log("Started");