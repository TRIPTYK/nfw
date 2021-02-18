import * as Boom from "@hapi/boom";
import { BaseMiddleware } from "@triptyk/nfw-core";
import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { User } from "../models/user.model";

@injectable()
export class ACLMiddleware extends BaseMiddleware {
    public async use(
        req: Request,
        response: Response,
        next: NextFunction
    ): Promise<any> {
        const user = req.user as User;

        if (!user) {
            return next(Boom.expectationFailed("You need to be identified"));
        }

        try {
            const can = await user.can(
                this.context.routeDefinition.methodName,
                req,
                this.context.controllerInstance.name
            );
            if (can.granted) {
                return next();
            }
            return next(Boom.forbidden("You can't do this"));
        } catch (e) {
            return next(e);
        }
    }
}
