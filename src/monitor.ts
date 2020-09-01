/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import {default as config} from "../ecosystem.config";

const [firstApp] = config.apps;
/* eslint-disable @typescript-eslint/camelcase */
import * as pm2 from "pm2";
import { container } from "tsyringe";
import { createConnection } from "typeorm";
import ConfigurationService from "./core/services/configuration.service";
const { execSync } = require("child_process");

process.on("SIGINT", function() {
    pm2.disconnect();
    process.exit(0);
});

pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.start(firstApp,(err) => {
        if (err) {
            throw err;
        }
    });

    pm2.launchBus(function(err: any, bus: any) {
        bus.on("process:msg",async function(packet) {
            switch(packet.data.type) {
                case "recompile-sync": {
                    execSync("rm -rf ./dist/src");
                    console.log("compiling");
                    execSync("./node_modules/.bin/tsc");
                    console.log("compiled");
                    const {typeorm} = container.resolve<ConfigurationService>(ConfigurationService).config;
                    const connection = await createConnection({
                        database: typeorm.database,
                        entities : typeorm.entities,
                        synchronize : typeorm.synchronize,
                        host: typeorm.host,
                        name: typeorm.name,
                        password: typeorm.pwd,
                        port: typeorm.port,
                        type: typeorm.type as any,
                        migrations : typeorm.migrations,
                        username: typeorm.user,
                        cli : {
                            entitiesDir: typeorm.entitiesDir,
                            migrationsDir: typeorm.migrationsDir,
                        }
                    });
                    await connection.synchronize();
                    console.log("Synchronized");
                    await connection.close();
                    pm2.restart(firstApp.name,() => {
                        if (err) {
                            throw err;
                        }
                        console.log("Restarted app " + firstApp.name);
                    });
                    break;
                }
                case "recompile": {
                    execSync("rm -rf ./dist/src");
                    console.log("compiling");
                    execSync("./node_modules/.bin/tsc");
                    console.log("compiled");
                    pm2.restart(firstApp.name,() => {
                        if (err) {
                            throw err;
                        }
                        console.log("Restarted app " + firstApp.name);
                    });
                    break;
                }
            }
        });
    });
});
