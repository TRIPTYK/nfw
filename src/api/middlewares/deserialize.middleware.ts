import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Request , Response } from "express";
import { container, injectable } from "tsyringe";
import { BaseSerializer } from "../serializers/base.serializer";

@injectable()
export default class DeserializeMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: (err?: any) => void, args: any) {
        if (!req.body.data || !req.body.data.attributes) {
            return next();
        }

        const fields = (container.resolve(args) as BaseSerializer).deserialize(req);
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
