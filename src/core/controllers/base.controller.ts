import ControllerInterface from "../interfaces/controller.interface";
import { Request , Response } from "express";
import { ApplicationRegistry } from "../application/registry.application";

export default class BaseController implements ControllerInterface {
    public constructor() {
        ApplicationRegistry.registerController(this);
    }

    public init() {
        return;
    }

    public callMethod(methodName: string | number): any {
        return async (req: Request, res: Response, next: (arg0: any) => any) => {
            try {
                const response = await this[methodName](req, res);
                if (!res.headersSent) {
                    res.send(response);
                }
            } catch (e) {
                return next(e);
            }
        }
    }
}
