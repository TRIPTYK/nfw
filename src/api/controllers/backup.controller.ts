import {
    ApplicationLifeCycleEvent,
    ApplicationRegistry,
    BaseController,
    Controller,
    Post
} from "@triptyk/nfw-core";
import { Request, Response } from "express";
import * as SocketIO from "socket.io-client";
import { autoInjectable } from "tsyringe";

@Controller("backup")
@autoInjectable()
export class BackupController extends BaseController {
    private socket = null;

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
