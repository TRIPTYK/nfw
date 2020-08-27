import { Controller, Get } from "../../core/decorators/controller.decorator";
import { Request , Response } from "express";
import ControllerInterface from "../../core/interfaces/controller.interface";
import BaseController from "../../core/controllers/base.controller";

@Controller("status")
export default class StatusController extends BaseController {
    @Get("/")
    public status(req: Request, res: Response): void {
        res.sendStatus(200);
    }
}
