import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { ApplicationRegistry } from "../../core/application/registry.application";
import BaseController from "../../core/controllers/base.controller";
import { Controller, Get } from "../../core/decorators/controller.decorator";

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
