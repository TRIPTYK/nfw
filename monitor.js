/* eslint-disable @typescript-eslint/camelcase */
const pm2 = require("pm2");
const { writeFileSync } = require("fs");
const { execSync } = require("child_process");

pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.restart({
        name : "NFW",
        script    : "./dist/src/app.bootstrap.js",     // Script to be run
        env: {
            NODE_ENV: "production"
        },
        instances : 1,                // Optional: Scales your app by 4
        max_memory_restart : "500M"   // Optional: Restarts your app if it reaches 100Mo
    }, function(err, apps) {
        if (err) {throw err}
    });

    pm2.launchBus(function(err, bus) {
        bus.on("process:msg", function(packet) {
            switch(packet.data.type) {
                case "recompile": {
                    execSync("rm -rf ./dist/src");
                    console.log("compiling");
                    execSync("./node_modules/.bin/tsc");
                    console.log("compiled");
                    execSync("NODE_ENV=production npm run schema-sync");
                    pm2.restart({
                        name : "NFW",
                        script    : "./dist/src/app.bootstrap.js",     // Script to be run
                        env: {
                            NODE_ENV: "production"
                        },
                        instances : 1,                // Optional: Scales your app by 4
                        max_memory_restart : "500M"   // Optional: Restarts your app if it reaches 100Mo
                    }, function(err, apps) {
                        if (err) {throw err}
                    });
                }
            }
        });
    });
});
