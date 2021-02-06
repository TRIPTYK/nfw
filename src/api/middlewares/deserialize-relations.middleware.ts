import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Type } from "ts-morph";

export type DeserializeRelationsMiddlewareArgs = {
    schema: Type<any>;
};

@injectable()
export default class DeserializeRelationsMiddleware extends BaseMiddleware {
    public async use(
        req: Request,
        response: Response,
        next: NextFunction,
        args: DeserializeRelationsMiddlewareArgs
    ) {
        return next();
    }
}
