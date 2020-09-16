/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post, Delete, MethodMiddleware } from "../../decorators/controller.decorator";
import { generateJsonApiEntity, deleteJsonApiEntity, addColumn, removeColumn } from "../../cli";
import { Request , Response } from "express";
import ValidationMiddleware from "../../middlewares/validation.middleware";
import { createEntity, createColumn, createRelation } from "../../validation/generator.validation";
import { removeRelation } from "../../cli/commands/remove-relation";
import addRelation from "../../cli/commands/add-relation";
const project = require("../../cli/utils/project");

/**
 * Generates app
 */
@Controller("generate")
export default class GeneratorController extends BaseController {
    @Post("/entity/:name")
    @MethodMiddleware(ValidationMiddleware,{schema : createEntity, location: ["body"]})
    public async generateEntity(req: Request, _res: Response) {
        await generateJsonApiEntity(req.params.name,{
            columns : req.body.columns,
            relations : req.body.relations
        });

        await project.save();
            
        process.send({
            type : "process:msg",
            data : {
                type : "recompile-sync",
                data: {}
            }
        });
    }

    @Post("/entity/:name/relation")
    @MethodMiddleware(ValidationMiddleware,{schema : createRelation, location: ["body"]})
    public async addEntityRelation(req: Request, _res: Response) {
        await addRelation(req.params.name,req.body);
        await project.save();
    }

    @Post("/entity/:name/:column")
    @MethodMiddleware(ValidationMiddleware,{schema : createColumn, location: ["body"]})
    public async generateColumn(req: Request, _res: Response) {
        await addColumn(req.params.name,req.body);
        await project.save();
        process.send({
            type : "process:msg",
            data : {
                type : "recompile-sync",
                data: {}
            }
        });
    }

    @Delete("/entity/:name/:column")
    public async deleteEntityColumn(req: Request, _res: Response) {
        await removeColumn(req.params.name,req.params.column);
        await project.save();
    }

    @Delete("/entity/:name/relation/:relation")
    public async deleteEntityRelation(req: Request, _res: Response) {
        await removeRelation(req.params.name,req.params.relation);
        await project.save();
    }

    @Delete("/entity/:name")
    public async deleteEntity(req: Request, _res: Response) {
        await deleteJsonApiEntity(req.params.name);
        await project.save();
        process.send({
            type : "process:msg",
            data : {
                type : "recompile",
                data: {}
            }
        });
    }
}

