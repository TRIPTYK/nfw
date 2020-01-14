const mkdirp = require('mkdirp');
const spawn = require('cross-spawn');
const fs = require('fs');

const dirs = [
    './dist/logs',
    './dist/uploads/documents/xs',
    './dist/uploads/documents/md',
    './dist/uploads/documents/xl'
];

for (const dir of dirs) {
    console.log(`Creating ${dir} ...`);
    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
        console.log(`${dir} created`);
    }else{
        console.log(`${dir} already exists , skipping ...`);
    }
}

console.log("Compiling...");
spawn.sync(`./node_modules/.bin/tsc`, [], { stdio: 'inherit' });
console.log("Compiling done");

// pm2 reload ecosystem.config.js --env production