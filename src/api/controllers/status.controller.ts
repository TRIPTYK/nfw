import { Controller, Get } from "../../core/decorators/controller.decorator";
import { Request , Response } from "express";

@Controller("status")
export default class StatusController {
    @Get("/")
    public status(req: Request, res: Response) {
        res.sendStatus(200);
    }
}
