import {
    ApplicationRegistry,
    BaseController,
    Controller,
    Get
} from "@triptyk/nfw-core";
import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";

@Controller("status")
@autoInjectable()
export default class StatusController extends BaseController {
    @Get("/")
    public status(req: Request, res: Response): void {
        res.json({
            status: ApplicationRegistry.status,
            guid: ApplicationRegistry.guid
        });
    }
}
