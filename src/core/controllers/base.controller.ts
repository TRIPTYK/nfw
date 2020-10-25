import ControllerInterface from "../interfaces/controller.interface";
import { Request, Response } from "express";
import { ApplicationRegistry } from "../application/registry.application";

export default abstract class BaseController implements ControllerInterface {
    public name: string;

    public constructor() {
        ApplicationRegistry.registerController(this);
        this.name = Reflect.getMetadata("routeName", this);
    }

    public init() {
        // eslint-disable-next-line no-useless-return
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
