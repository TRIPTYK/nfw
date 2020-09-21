/* eslint-disable no-console */
import "reflect-metadata";
import {default as config} from "../ecosystem.config";

const [firstApp] = config.apps;
import * as pm2 from "pm2";
import { container } from "tsyringe";
import { createConnection } from "typeorm";
import ConfigurationService from "./core/services/configuration.service";
import * as tar from "tar";
import { execSync } from "child_process";
import * as SocketIO from "socket.io";
import { createWriteStream } from "fs";
import { join } from "path";

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

    const io = SocketIO();
    io.on('connection', client => {
        client.on("app-save",(name, fn) => {
            tar.c({gzip:true},['src/api'])
                .pipe(createWriteStream(join(process.cwd(),"dist","backup.tar.gz")));
            fn("ok");
        });
        client.on('app-recompile-sync', async (name, fn) => {
            console.log("boup");
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
            fn("ok");
        });
        client.on('app-restart', async (name, fn) => {
            pm2.restart(firstApp.name,() => {
                if (err) {
                    throw err;
                }
                console.log("Restarted app " + firstApp.name);
                fn("ok");
            });
        });
    });
    
    io.listen(3000);
});
