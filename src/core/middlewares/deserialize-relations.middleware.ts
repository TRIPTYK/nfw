import { BaseMiddleware } from "./base.middleware";
import { Request, Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";

export type DeserializeRelationsMiddlewareArgs = {
    serializer: Constructor<BaseJsonApiSerializer<any>>;
    schema?: string;
};

@injectable()
export default class DeserializeRelationsMiddleware extends BaseMiddleware {
    public async use(
        req: Request,
        response: Response,
        next: NextFunction,
        args: DeserializeRelationsMiddlewareArgs
    ): Promise<any> {
        const serializerInstance = container.resolve(args.serializer);
        const schema = serializerInstance.getSchema(args.schema ?? "default");

        const relations = Reflect.getMetadata("relations", schema);

        return next();
    }
}
