/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post } from "../../decorators/controller.decorator";
import { generateJsonApiEntity } from "../../cli";
import { Request , Response } from "express";
import { Column } from "../../cli/interfaces/generator.interface";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("generate")
export default class GeneratorController extends BaseController {
    @Post("entity/:name")
    public generateEntity(req: Request, _res: Response) {
        const columns: Column[] = [];

        return generateJsonApiEntity(req.params.name,{
            create : true,
            update : true,
            delete : true,
            read : true
        },{
            columns,
            relations : []
        });
    }

    private restartServer() {
        process.exit(0);
    }
}

