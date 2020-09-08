import { injectable } from "tsyringe";
import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Response , Request , NextFunction} from "express";
import { User } from "../models/user.model";
import * as Boom from "@hapi/boom";

@injectable()
export default class ACLMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction, args: any): Promise<any> {
        const user = req.user as User;

        if (!user) {
            return next(Boom.expectationFailed("You need to be identified"));
        }

        const can = await user.can(user.role,req.body,this.context.routeDefinition.methodName);

        if (can.granted) {
            return next();
        }else{
            return next(Boom.unauthorized("You can't do this"));
        }
    }
}
