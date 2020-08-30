/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post, Delete } from "../../decorators/controller.decorator";
import { generateJsonApiEntity, deleteJsonApiEntity } from "../../cli";
import { Request , Response } from "express";
import { Column } from "../../cli/interfaces/generator.interface";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("generate")
export default class GeneratorController extends BaseController {
    @Post("/entity/:name")
    public generateEntity(req: Request, _res: Response) {
        const columns: Column[] = [{
            name: "testColumn",
            type: "varchar",
            length: 255,
            nullable: false,
            default: undefined,
            isPrimary: false,
            isUnique: false
        }];

        return generateJsonApiEntity(req.params.name,{
            columns,
            relations : []
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

