import { Controller, Get } from "../../core/decorators/controller.decorator";
import { Request, Response } from "express";
import BaseController from "../../core/controllers/base.controller";
import { autoInjectable } from "tsyringe";
import { ApplicationRegistry } from "../../core/application/registry.application";

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
