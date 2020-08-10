import { Controller, Get } from "../../core/decorators/controller.decorator";
import { Request , Response } from "express";
import ControllerInterface from "../../core/interfaces/controller.interface";

@Controller("status")
export default class StatusController implements ControllerInterface {
    @Get("/")
    public status(req: Request, res: Response): void {
        res.sendStatus(200);
    }
}
