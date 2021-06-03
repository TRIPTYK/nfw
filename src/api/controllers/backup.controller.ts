import { Controller, Get, Post, WsController } from "@triptyk/nfw-core";
import { Request, Response } from "express";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { autoInjectable } from "tsyringe";

@Controller("backup")
@autoInjectable()
export class BackupController extends WsController {
    private backupFolder = join(process.cwd(), "dist", "backups");

    constructor() {
        super("http://localhost:3000", undefined, () => {
            this.socket.on("status", (status: string) => {
                if (status === "running") {
                    this.socket.emit("message", "backup system operational");
                }
            });
        });
    }

    @Get("/")
    public async getBackups(req: Request, res: Response) {
        res.send({
            backupList: readdirSync(this.backupFolder)
                .filter((b) => /backup.{0,}\.tar\.gz/.test(b))
                .map((file) => {
                    return {
                        file,
                        date: statSync(join(this.backupFolder, file)).birthtime
                    };
                })
        });
    }

    @Post()
    public async restore(req: Request, res: Response) {
        const { name } = req.body;
        await this.sendMessageAndWaitResponse("restore-backup", name);
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
}
