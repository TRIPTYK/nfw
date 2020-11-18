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
import { Server } from "socket.io";
import { createWriteStream } from "fs";
import { join } from "path";
import * as Http from "http";

process.on("SIGINT", () => {
    console.log("terminated");
    pm2.disconnect();
    process.exit(0);
});

pm2.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.stop(firstApp.name, (err) => {
        pm2.start(firstApp, (err) => {
            if (err) {
                throw err;
            }
        });
    });
    

    const server = Http.createServer();

    const {typeorm} = container.resolve<ConfigurationService>(ConfigurationService).config;

    const CORSOptions = {
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        origin: "http://localhost:4200",
        credentials: true
    };

    const io = new Server(server, {
        cors: CORSOptions,
        allowRequest: (req, callback) => {
            console.log(req.headers);
            callback(null, true);
        }
    });
    
    io.on('connection', client => {
        console.log("client connected", client.id);
        client.emit("hello", client.id);
        client.on("app-save", (name, fn) => {
            tar.c({gzip:true}, ['src/api'])
                .pipe(createWriteStream(join(process.cwd(), "dist", "backup.tar.gz")));
            fn("ok");
        });
        client.on('app-recompile-sync', async (name, fn) => {
            execSync("rm -rf ./dist/src");
            io.emit("event", "compiling");
            try {
                execSync("./node_modules/.bin/tsc");
            }catch(e) {
                fn("compiling-error");
            }
            io.emit("event", "compiled");
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
                    migrationsDir: typeorm.migrationsDir
                }
            });
            try {
                await connection.synchronize();
            }catch(e) {
                fn("synchronize-error");
            }
            await connection.close();
            io.emit("event", "synchronized");
            fn("ok");
        });
        client.on('app-restart', async (name, fn) => {
            io.emit("event", "app-restarting");
            pm2.restart(firstApp.name, () => {
                if (err) {
                    throw err;
                }
                console.log(`Restarted app ${ firstApp.name}`);
                io.emit("event", "app-restarted");
                fn("ok");
            });
        });
    });

    io.listen(3000);
});
