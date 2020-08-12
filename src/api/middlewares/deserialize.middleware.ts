import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Request , Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import { BaseSerializer } from "../../core/serializers/base.serializer";
import { Type } from "../../core/types/global";

@injectable()
export default class DeserializeMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: Type<BaseSerializer<any>>): Promise<any> {
        if (!req.body.data || !req.body.data.attributes) {
            return next();
        }

        const fields = await (container.resolve(args)).deserializeAsync(req.body);

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
