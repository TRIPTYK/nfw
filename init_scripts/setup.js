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
    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
        console.log(`${dir} created`);
    }else{
        console.log(`${dir} already exists , skipping ...`);
    }
}

spawn.sync(`npm install`, [], { stdio: 'inherit' });

console.log("Compiling...");
spawn.sync(`./node_modules/.bin/tsc`, [], { stdio: 'inherit' });
console.log("Compiling done");
