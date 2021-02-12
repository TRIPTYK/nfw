/* eslint-disable arrow-body-style */
import { Request, Response } from "express";
import * as HttpStatus from "http-status";
import * as SocketIO from "socket.io-client";
import {
    ApplicationLifeCycleEvent,
    ApplicationRegistry
} from "../../application/registry.application";
import {
    Controller,
    Delete,
    MethodMiddleware,
    Post
} from "../../decorators/controller.decorator";
import addColumn from "../../generator/commands/add-column";
import addRelation from "../../generator/commands/add-relation";
import deleteJsonApiEntity from "../../generator/commands/delete-entity";
import generateJsonApiEntity from "../../generator/commands/generate-entity";
import removeColumn from "../../generator/commands/remove-column";
import { removeRelation } from "../../generator/commands/remove-relation";
import project from "../../generator/utils/project";
import ValidationMiddleware from "../../middlewares/validation.middleware";
import {
    columnsActions,
    createColumn,
    createEntity,
    createRelation
} from "../../validation/generator.validation";
import BaseController from "../base.controller";

/**
 * Generates app
 */
@Controller("generate")
export default class GeneratorController extends BaseController {
    public socket: SocketIOClient.Socket = null;

    @Post("/entity/:name")
    @MethodMiddleware(ValidationMiddleware, {
        schema: createEntity,
        location: ["body"]
    })
    public async generateEntity(req: Request, res: Response) {
        await generateJsonApiEntity(req.params.name, {
            columns: req.body.columns,
            relations: req.body.relations
        });
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/entity/:name/relation")
    @MethodMiddleware(ValidationMiddleware, {
        schema: createRelation,
        location: ["body"]
    })
    public async addEntityRelation(req: Request, res: Response) {
        await addRelation(req.params.name, req.body);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/entity/:name/column")
    @MethodMiddleware(ValidationMiddleware, {
        schema: createColumn,
        location: ["body"]
    })
    public async generateColumn(req: Request, res: Response) {
        await addColumn(req.params.name, req.body);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/entity/:name/entity-actions")
    @MethodMiddleware(ValidationMiddleware, {
        schema: columnsActions,
        location: ["body"]
    })
    public async do(req: Request, res: Response) {
        for (const column of req.body.columns) {
            if (column.action === "ADD") {
                await addColumn(req.params.name, column);
            }
            if (column.action === "REMOVE") {
                await removeColumn(req.params.name, column);
            }
        }
        for (const column of req.body.relations) {
            if (column.action === "ADD") {
                await addRelation(req.params.name, column);
            }
            if (column.action === "REMOVE") {
                await removeRelation(req.params.name, column);
            }
        }
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/entity/:name/:column")
    public async deleteEntityColumn(req: Request, res: Response) {
        await removeColumn(req.params.name, req.params.column);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/entity/:name/relation/:relation")
    public async deleteEntityRelation(req: Request, res: Response) {
        await removeRelation(req.params.name, req.params.relation);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/entity/:name")
    public async deleteEntity(req: Request, res: Response) {
        await deleteJsonApiEntity(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

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

            // removeRelation("user", "documents").then(() => project.save());
        });
    }

    private sendMessageAndWaitResponse(type: string, data?: any) {
        return new Promise((resolve, rej) => {
            this.socket.emit(type, data, (response) => {
                if (response !== "ok") {
                    rej(response);
                } else {
                    resolve(response);
                }
            });
        });
    }
}
