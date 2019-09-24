const mkdirp = require('mkdirp');
const spawn = require('cross-spawn');

const dirs = [
    './dist/logs',
    './dist/uploads/documents/xs',
    './dist/uploads/documents/md',
    './dist/uploads/documents/xl'
];

for (const dir of dirs) {
    console.log(`Creating ${dir} ...`);
    mkdirp.sync(dir);
}

spawn.sync(`npm install`, [], { stdio: 'inherit' });

console.log("Compiling...");
spawn.sync(`./node_modules/.bin/tsc`, [], { stdio: 'inherit' });
console.log("Compiling done");

