/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post, Delete, MethodMiddleware } from "../../decorators/controller.decorator";
import { generateJsonApiEntity, deleteJsonApiEntity, addColumn, removeColumn } from "../../cli";
import { Request, Response } from "express";
import ValidationMiddleware from "../../middlewares/validation.middleware";
import { createEntity, createColumn, createRelation } from "../../validation/generator.validation";
import { removeRelation } from "../../cli/commands/remove-relation";
import addRelation from "../../cli/commands/add-relation";
import * as SocketIO from "socket.io-client";
import * as HttpStatus from "http-status";
import { autoInjectable } from "tsyringe";
import project = require("../../cli/utils/project");
import { rejects } from "assert";

/**
 * Generates app
 */
@Controller("generate")
@autoInjectable()
export default class GeneratorController extends BaseController {
    public socket: SocketIOClient.Socket = null;

    @Post("/entity/:name")
    @MethodMiddleware(ValidationMiddleware, {schema : createEntity, location: ["body"]})
    public async generateEntity(req: Request, res: Response) {
        await generateJsonApiEntity(req.params.name, {
            columns : req.body.columns,
            relations : req.body.relations
        });
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/entity/:name/relation")
    @MethodMiddleware(ValidationMiddleware, {schema : createRelation, location: ["body"]})
    public async addEntityRelation(req: Request, res: Response) {
        await addRelation(req.params.name, req.body);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Post("/entity/:name/:column")
    @MethodMiddleware(ValidationMiddleware, {schema : createColumn, location: ["body"]})
    public async generateColumn(req: Request, res: Response) {
        await addColumn(req.params.name, req.body);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/entity/:name/:column")
    public async deleteEntityColumn(req: Request, res: Response) {
        await removeColumn(req.params.name, req.params.column);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/entity/:name/relation/:relation")
    public async deleteEntityRelation(req: Request, res: Response) {
        await removeRelation(req.params.name, req.params.relation);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-restart");
    }

    @Delete("/entity/:name")
    public async deleteEntity(req: Request, res: Response) {
        await deleteJsonApiEntity(req.params.name);
        await this.sendMessageAndWaitResponse("app-save");
        await project.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-restart");
    }

    constructor() {
        super();
        this.socket = SocketIO('http://localhost:3000');
    }

    private async sendMessageAndWaitResponse(type: string, data?: any) {
        return new Promise((resolve, rej) => {
            this.socket.emit(type, data, (response) => {
                if (response !== "ok") {
                    rej(response);
                }else{
                    resolve(response);
                }
            });
        }) 
    }
}





