import { BaseMiddleware } from "./base.middleware";
import { Request, Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Type } from "../types/global";

export type DeserializeMiddlewareArgs = {
    serializer: Type<BaseJsonApiSerializer<any>>;
    schema?: string;
}

@injectable()
export default class DeserializeMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: DeserializeMiddlewareArgs): Promise<any> {
        if (!req.body.data) {
            return next();
        }

        const fields = await (container.resolve(args.serializer)).deserialize(req.body);
        req.body = {};

        for (const key in fields) {
            if (key !== "id") {
                req.body[key] = fields[key];
            } else {
                delete req.body[key];
            }
        }

        return next();
    }
}
