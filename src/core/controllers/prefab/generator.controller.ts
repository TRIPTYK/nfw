/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post, Delete, MethodMiddleware } from "../../decorators/controller.decorator";
import { generateJsonApiEntity, deleteJsonApiEntity } from "../../cli";
import { Request , Response } from "express";
import ValidationMiddleware from "../../middlewares/validation.middleware";
import { createEntity } from "../../validation/generator.validation";

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
                    type : "recompile",
                    data: {}
                }
            });
        });
    }

    @Delete("/entity/:name")
    public deleteEntity(req: Request, _res: Response) {
        return deleteJsonApiEntity(req.params.name);
    }

    private restartServer() {
        process.exit(0);
    }
}

