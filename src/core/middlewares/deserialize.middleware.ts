import { BaseMiddleware } from "./base.middleware";
import { Request , Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Type } from "../types/global";

@injectable()
export default class DeserializeMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: {
        serializer: Type<BaseJsonApiSerializer<any>>;
        schema?: string;
    }): Promise<any> {
        if (!req.body.data) {
            return next();
        }

        console.log(req.body);
        const fields = await (container.resolve(args.serializer)).deserializeAsync(req.body);
        console.log(fields);
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
