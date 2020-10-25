import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";

export type DeserializeRelationsMiddlewareArgs = any;

@injectable()
export default class DeserializeRelationsMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction) {
        return next();
    }
}
