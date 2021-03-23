import {
    ApplicationLifeCycleEvent,
    ApplicationRegistry,
    BaseController,
    Controller,
    Get,
    Post
} from "@triptyk/nfw-core";
import { Request, Response } from "express";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import * as SocketIO from "socket.io-client";
import { autoInjectable } from "tsyringe";

@Controller("backup")
@autoInjectable()
export class BackupController extends BaseController {
    private socket = null;
    private backupFolder = join(process.cwd(), "dist", "backups");

    constructor() {
        super();
        this.socket = SocketIO("http://localhost:3000", {
            query: {
                app: false
            }
        });
        ApplicationRegistry.on(ApplicationLifeCycleEvent.Running, () => {
            this.socket.on("connect", () => {
                this.socket.emit("hello");
            });
        });
    }

    @Get("/")
    public async getBackups(req: Request, res: Response) {
        res.send({
            backupList: readdirSync(this.backupFolder)
                .filter((b) => /backup.{0,}\.tar\.gz/.test(b))
                .map((d) => {
                    return {
                        file: d,
                        date: statSync(join(this.backupFolder, d)).birthtime
                    };
                })
        });
    }

    @Post()
    public async restore(req: Request, res: Response) {
        await this.sendMessageAndWaitResponse("restore-backup");
        res.status(200).send();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post()
    public async save(req: Request, res: Response) {
        await this.sendMessageAndWaitResponse("app-save");
        res.status(200).send();
    }

    @Post()
    public async restart(req: Request, res: Response) {
        res.status(200).send();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    private sendMessageAndWaitResponse(type: string, data?: any) {
        return new Promise((resolve, rej) => {
            this.socket.emit(type, data, (response) => {
                if (response === "ok") {
                    resolve(response);
                } else {
                    rej(response);
                }
            });
        });
    }
}
