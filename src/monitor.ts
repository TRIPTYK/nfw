/* eslint-disable no-console */
import {
    ConfigurationService,
    Connection,
    createConnection,
    getConnectionManager
} from "@triptyk/nfw-core";
import { execSync } from "child_process";
import { createWriteStream, unlinkSync } from "fs";
import * as Http from "http";
import { join } from "path";
import * as pm2 from "pm2";
import "reflect-metadata";
import { Server } from "socket.io";
import * as tar from "tar";
import { container } from "tsyringe";
import * as config from "../ecosystem.config";
import { recursiveReadDir } from "./utils/recursiveDir";

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

    const backupDirs = ["src/api", "src/test"];

    /**
     * Change the current websocket status.
     * @param newStatus new web socket status.
     */
    const changeStatus = (newStatus: string) => {
        status = newStatus;
        console.log(status);
        io.emit("status", newStatus);
    };

    /**
     * Restore the last saved backup.
     * @param deleteSupp If true, all files not included in the backup will be deleted.
     */
    const restoreBackup = (deleteSupp = true) => {
        if (deleteSupp) {
            const backupFiles = execSync("tar -tvf dist/backup.tar.gz")
                .toString()
                .split("\n");
            for (const dir of backupDirs) {
                const delFiles = recursiveReadDir(dir)
                    .map((f) => f.path)
                    .filter((f) => !backupFiles.includes(f));
                for (const file of delFiles) unlinkSync(file);
            }
        }
        return tar.x({
            file: join(process.cwd(), "dist", "backup.tar.gz")
        });
    };

    /**
     * Save the current configuration.
     */
    const saveBackup = () => {
        return new Promise((res, rej) => {
            tar.c({ gzip: true }, backupDirs)
                .pipe(
                    createWriteStream(
                        join(process.cwd(), "dist", "backup.tar.gz")
                    )
                )
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

        client.on("restore-backup", async (name, fn) => {
            try {
                await restoreBackup();
                changeStatus("restorded");
                fn("ok");
            } catch (error) {
                changeStatus("error");
                console.log(error);
            }
        });

        client.on("app-save", async (name, fn) => {
            await saveBackup();
            fn("ok");
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
                //await connection.synchronize();
                execSync(
                    "./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js schema:sync"
                );
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
