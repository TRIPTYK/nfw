/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post, Delete, MethodMiddleware } from "../../decorators/controller.decorator";
import { generateJsonApiEntity, deleteJsonApiEntity, addColumn } from "../../cli";
import { Request , Response } from "express";
import ValidationMiddleware from "../../middlewares/validation.middleware";
import { createEntity, createColumn } from "../../validation/generator.validation";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("generate")
export default class GeneratorController extends BaseController {
    @Post("/entity/:name")
    @MethodMiddleware(ValidationMiddleware,{schema : createEntity, location: ["body"]})
    public generateEntity(req: Request, _res: Response) {
        return generateJsonApiEntity(req.params.name,{
            columns : req.body.columns,
            relations : []
        }).then((e) => {
            process.send({
                type : "process:msg",
                data : {
                    type : "recompile-sync",
                    data: {}
                }
            });
        });
    }

    @Post("/entity/:name/:column")
    @MethodMiddleware(ValidationMiddleware,{schema : createColumn, location: ["body"]})
    public generateColumn(req: Request, _res: Response) {
        return addColumn(req.params.name,req.body).then((e) => {
            process.send({
                type : "process:msg",
                data : {
                    type : "recompile-sync",
                    data: {}
                }
            });
        });
    }

    @Delete("/entity/:name")
    public deleteEntity(req: Request, _res: Response) {
        return deleteJsonApiEntity(req.params.name).then(() => {
            process.send({
                type : "process:msg",
                data : {
                    type : "recompile",
                    data: {}
                }
            });
        });
    }

    private restartServer() {
        process.exit(0);
    }
}

