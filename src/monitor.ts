/* eslint-disable no-console */
import { execSync } from "child_process";
import { createWriteStream } from "fs";
import * as Http from "http";
import { join } from "path";
import * as pm2 from "pm2";
import "reflect-metadata";
import { Server } from "socket.io";
import * as tar from "tar";
import { container } from "tsyringe";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import * as config from "../ecosystem.config";
import ConfigurationService from "./core/services/configuration.service";

const [, firstApp] = config.apps;

console.log(firstApp);

process.on("SIGINT", () => {
    console.log("terminated");
    pm2.disconnect();
    process.exit(0);
});

pm2.connect(async (err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.stop(firstApp.name, () => {
        pm2.start(firstApp, (err) => {
            if (err) {
                throw err;
            }
        });
    });

    const server = Http.createServer();

    const { typeorm } = container.resolve<ConfigurationService>(
        ConfigurationService
    ).config;

    const CORSOptions = {
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        origin: true,
        credentials: true
    };

    const io = new Server(server, {
        cors: CORSOptions
    });

    let status = "";

    const changeStatus = (newStatus: string) => {
        status = newStatus;
        console.log(status);
        io.emit("status", newStatus);
    };

    const restoreBackup = () => {
        return new Promise((res, rej) => {
            tar.c({ gzip: true }, ["src/api"])
                .pipe(
                    createWriteStream(
                        join(process.cwd(), "dist", "backup.tar.gz")
                    )
                )
                .on("error", () => {
                    rej();
                })
                .on("finish", () => {
                    res(true);
                });
        });
    };

    io.on("connection", (client) => {
        console.log("Client connected", client.id);

        client.emit("status", status);

        client.on("hello", async () => {
            changeStatus("running");
        });

        client.on("app-save", (name, fn) => {
            tar.c({ gzip: true }, ["src/api"])
                .pipe(
                    createWriteStream(
                        join(process.cwd(), "dist", "backup.tar.gz")
                    )
                )
                .on("finish", () => {
                    fn("ok");
                });
        });
        client.on("app-recompile-sync", async (name, fn) => {
            let connection: Connection;
            try {
                connection = await createConnection({
                    database: typeorm.database,
                    entities: typeorm.entities,
                    synchronize: typeorm.synchronize,
                    host: typeorm.host,
                    name: typeorm.name,
                    password: typeorm.pwd,
                    port: typeorm.port,
                    type: typeorm.type as any,
                    migrations: typeorm.migrations,
                    username: typeorm.user,
                    cli: {
                        entitiesDir: typeorm.entitiesDir,
                        migrationsDir: typeorm.migrationsDir
                    }
                });
            } catch (err) {
                if (err.name === "AlreadyHasActiveConnectionError") {
                    connection = getConnectionManager().get("default");
                } else {
                    changeStatus("error");
                    return;
                }
            }
            changeStatus("compiling");
            try {
                execSync("rm -rf ./dist/src");
                execSync("./node_modules/.bin/tsc");
            } catch (e) {
                console.log(e);
                changeStatus("error");
                return;
            }
            changeStatus("compiled");
            changeStatus("synchronizing");
            try {
                await connection.synchronize();
                changeStatus("synchronized");
            } catch (e) {
                console.log(e);
                changeStatus("error");
                return;
            }
            fn("ok");
        });
        client.on("app-restart", async (name, fn) => {
            changeStatus("restarting");
            pm2.restart(firstApp.name, () => {
                if (err) {
                    throw err;
                }
                console.log(`Restarted app ${firstApp.name}`);
                changeStatus("restarted");
                fn("ok");
            });
        });
    });

    io.listen(3000);
});
