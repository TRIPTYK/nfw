import { Controller, Get } from "../decorators/controller.decorator";
import { Request , Response } from "express";

@Controller("status")
export default class StatusController {
    @Get("/")
    public status(req: Request, res: Response, next) {
        res.sendStatus(200);
    }
}