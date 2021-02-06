import * as Express from "express";
import { ApplicationRegistry } from "../application/registry.application";
import ControllerInterface from "../interfaces/controller.interface";

export default abstract class BaseController implements ControllerInterface {
    public name: string;

    public constructor() {
        ApplicationRegistry.registerController(this);
        this.name = Reflect.getMetadata("routeName", this);
    }

    public callMethod(methodName: string) {
        const middlewareFunction = async (
            req: Express.Request,
            res: Express.Response,
            next: (arg0: any) => any
        ) => {
            try {
                const response = await this[methodName](req, res);
                if (!res.headersSent) {
                    res.send(response);
                }
            } catch (e) {
                return next(e);
            }
        };
        return middlewareFunction.bind(this);
    }

    public init() {
        // eslint-disable-next-line no-useless-return
        return;
    }
}
