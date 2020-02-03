import { BaseMiddleware } from "./base.middleware";
import { injectable } from "tsyringe";
import { Request, Response } from "express";

@injectable()
export default class UserMiddleware extends BaseMiddleware {
    public use(req: Request, res: Response, next: (err?: any) => void, args: any) {
        throw new Error("Method not implemented.");
    }
}
