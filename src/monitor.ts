/* eslint-disable no-console */
import {
    ConfigurationService,
    Connection,
    createConnection,
    getConnectionManager
} from "@triptyk/nfw-core";
import { execSync } from "child_process";
import {
    createWriteStream,
    existsSync,
    mkdirSync,
    readdirSync,
    unlinkSync
} from "fs";
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

    //List of dirs to backup.
    const backupDirs = ["src/api", "src/test"];
    //Folder containing backups.
    const backupFolder = join(process.cwd(), "dist/backups");

    /**
     * Change the current websocket status.
     * @param newStatus new web socket status.
     */
    const changeStatus = (newStatus: string, data?: any) => {
        status = newStatus;
        console.log(status);
        if (newStatus === "error") data = data.message;
        io.emit("status", newStatus, data);
    };

    /**
     * Restore a saved backup.
     * @param name Name of the backup to recover, if omitted, the last backup will be used.
     * @param deleteSupp If true, all files not included in the backup will be deleted.
     */
    const restoreBackup = (name?: string, deleteSupp = true) => {
        name = name ?? readdirSync(backupFolder).slice(-1)[0];
        if (name) {
            const file = join(backupFolder, name);
            if (deleteSupp) {
                const backupFiles = execSync(`tar -tvf ${file}`)
                    .toString()
                    .split("\n");
                for (const backupDir of backupDirs) {
                    const delFiles = recursiveReadDir(backupDir)
                        .map((f) => f.path)
                        .filter((f) => !backupFiles.includes(f));
                    for (const delFile of delFiles) unlinkSync(delFile);
                }
            }
            return tar.x({ file });
        }
    };

    /**
     * Save the current configuration.
     */
    const saveBackup = () => {
        return new Promise((res, rej) => {
            //Create the backup folder if it doesn't exist yet.
            if (!existsSync(backupFolder))
                mkdirSync(backupFolder, { recursive: true });
            tar.c({ gzip: true }, backupDirs)
                .pipe(
                    createWriteStream(
                        //named like this: backupYYYYMMDDTHHMMSS.tar.gz
                        join(
                            backupFolder,
                            `backup${new Date()
                                .toISOString()
                                .slice(0, 19)
                                .replace(/[-:]+/g, "")}.tar.gz`
                        )
                    )
                )
                .on("finish", () => {
                    res(true);
                });
            //Above 10 backups, the oldest is erased.
            if (readdirSync(backupFolder).length > 10)
                unlinkSync(join(backupFolder, readdirSync(backupFolder)[0]));
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
                changeStatus("restoring");
                await restoreBackup(name);
                fn("ok");
                changeStatus("restorded");
            } catch (error) {
                changeStatus("error", error);
                console.log(error);
            }
        });

        client.on("app-save", async (name, fn) => {
            try {
                console.log("saving");
                await saveBackup();
                fn("ok");
                console.log("saved");
            } catch (error) {
                changeStatus("error", error);
                console.log(error);
            }
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
                    changeStatus("error", err);
                    return;
                }
            }
            changeStatus("compiling");
            try {
                execSync("rm -rf ./dist/src");
                execSync("./node_modules/.bin/tsc");
            } catch (e) {
                console.log(e);
                changeStatus("error", e);
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
                changeStatus("error", e);
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
