import * as Boom from "@hapi/boom";
import { BaseMiddleware } from "@triptyk/nfw-core";
import { NextFunction, Request, Response } from "express";
import * as Passport from "passport";
import { injectable } from "tsyringe";
import { promisify } from "util";
import { User } from "../models/user.model";
import { Roles } from "./../enums/role.enum";

export type AuthMiddlewareArgs = Roles[];

@injectable()
export class AuthMiddleware extends BaseMiddleware {
    public use(
        req: Request,
        res: Response,
        next: NextFunction,
        args: AuthMiddlewareArgs
    ) {
        return Passport.authenticate(
            "jwt",
            { session: false },
            this.handleJWT(req, res, next, args)
        )(req, res, next);
    }

    private handleJWT = (
        req: any,
        res: Response,
        next,
        roles: Roles[] = []
    ) => async (err: Error, user: User, info: any) => {
        const error = err || info;
        const logIn = promisify(req.logIn);

        try {
            if (error || !user) {
                throw error;
            }
            await logIn(user, { session: false });
        } catch (e) {
            return next(Boom.forbidden(e.message));
        }

        if (!roles.length) {
            req.user = user;
            return next();
        }

        if (!roles.includes(user.role)) {
            return next(Boom.forbidden("Forbidden area"));
        } else if (err || !user) {
            return next(Boom.badRequest(err.message));
        }

        req.user = user;

        return next();
    };
}
