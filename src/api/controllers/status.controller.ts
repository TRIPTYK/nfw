import { Controller, Get } from "../../core/decorators/controller.decorator";
import { Request, Response } from "express";
import BaseController from "../../core/controllers/base.controller";
import { singleton, autoInjectable } from "tsyringe";

@Controller("status")
@singleton()
@autoInjectable()
export default class StatusController extends BaseController {
    @Get("/")
    public status(req: Request, res: Response): void {
        res.sendStatus(200);
    }
}
