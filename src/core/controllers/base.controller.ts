import ControllerInterface from "../interfaces/controller.interface";
import { Request , Response, NextFunction } from "express";

export default class BaseController implements ControllerInterface {
    public init() {

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