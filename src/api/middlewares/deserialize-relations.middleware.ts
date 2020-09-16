import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Request , Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { JSONAPISerializerSchema } from "../../core/serializers/base.serializer";

@injectable()
export default class DeserializeRelationsMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: {
        schema?: JSONAPISerializerSchema;
        specificRelations?: string[];
    }) {


        return next();
    }
}
