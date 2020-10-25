import { injectable } from "tsyringe";
import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { Response, Request, NextFunction} from "express";
import { User } from "../models/user.model";
import * as Boom from "@hapi/boom";

@injectable()
export default class ACLMiddleware extends BaseMiddleware {
    public async use(req: Request, response: Response, next: NextFunction): Promise<any> {
        const user = req.user as User;

        if (!user) {
            return next(Boom.expectationFailed("You need to be identified"));
        }

        try {
            const can = await user.can(this.context.routeDefinition.methodName, req, this.context.controllerInstance.name);
            if (can.granted) {
                return next();
            }
            return next(Boom.forbidden("You can't do this"));
        }catch(e) {
            return next(e);
        }
    }
}
