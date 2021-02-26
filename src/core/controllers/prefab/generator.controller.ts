/* eslint-disable arrow-body-style */
import { Request, Response } from "express";
import * as HttpStatus from "http-status";
import * as SocketIO from "socket.io-client";
import { singleton } from "tsyringe";
import {
    ApplicationLifeCycleEvent,
    ApplicationRegistry
} from "../../application/registry.application";
import addColumn from "../../cli/commands/add-column";
import addEndpoint from "../../cli/commands/add-endpoint";
import addPerms from "../../cli/commands/add-permission";
import addRelation from "../../cli/commands/add-relation";
import addRole from "../../cli/commands/add-role";
import deleteJsonApiEntity from "../../cli/commands/delete-entity";
import deleteRole from "../../cli/commands/delete-role";
import deleteBasicRoute from "../../cli/commands/delete-route";
import generateJsonApiEntity from "../../cli/commands/generate-entity";
import generateBasicRoute from "../../cli/commands/generate-route";
import removeColumn from "../../cli/commands/remove-column";
import removeEndpoint from "../../cli/commands/remove-endpoint";
import removePerms from "../../cli/commands/remove-permissions";
import { removeRelation } from "../../cli/commands/remove-relation";
import project from "../../cli/utils/project";
import {
    Controller,
    Delete,
    MethodMiddleware,
    Post
} from "../../decorators/controller.decorator";
import ValidationMiddleware from "../../middlewares/validation.middleware";
import {
    columnsActions,
    createColumn,
    createEntity,
    createRelation,
    createRoute,
    createSubRoute
} from "../../validation/generator.validation";
import BaseController from "../base.controller";

/**
 * Generates app
 */
@Controller("generate")
@singleton()
export default class GeneratorController extends BaseController {
    public socket: SocketIOClient.Socket = null;

    @Post("/route/:name")
    @MethodMiddleware(ValidationMiddleware, {
        schema: createRoute,
        location: ["body"]
    })
    public async generateRoute(req: Request, res: Response) {
        await generateBasicRoute(req.params.name, req.body.methods);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/route/:name/subroute")
    @MethodMiddleware(ValidationMiddleware, {
        schema: createSubRoute,
        location: ["body"]
    })
    public async generateSubRoute(req: Request, res: Response) {
        await addEndpoint(req.params.name, req.body.method, req.body.subRoute);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

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

    @Post("/role/:name")
    public async generateRole(req: Request, res: Response) {
        await addRole(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/perms/:name")
    public async addPermissions(req: Request, res: Response) {
        await addPerms(req.params.name, req.body.role);
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

    @Delete("/route/:name")
    public async deleteRoute(req: Request, res: Response) {
        await deleteBasicRoute(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/route/:name/subroute/:methodName")
    public async deleteSubRoute(req: Request, res: Response) {
        await removeEndpoint(req.params.name, req.params.methodName);
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

    @Delete("/role/:name")
    public async deleteRole(req: Request, res: Response) {
        await deleteRole(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/perms/:name")
    public async removePerms(req: Request, res: Response) {
        await removePerms(req.params.name, req.body.role);
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
