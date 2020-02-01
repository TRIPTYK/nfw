import * as Passport from "passport";
import * as Boom from "@hapi/boom";

import { User } from "../models/user.model";
import { promisify } from "util";
import { Roles } from "./../enums/role.enum";
import { Request , Response } from "express";
import { injectable } from "tsyringe";
import { IMiddleware } from "./base.middleware";

@injectable()
export default class AuthMiddleware implements IMiddleware {
    public use(req: Request, res: Response, next: () => void, args) {
        return Passport.authenticate( "jwt", { session: false },
            this.handleJWT(req, res, next, args) ) (req, res, next);
    }

    private handleJWT = (req: any, res: Response, next , roles: any) => async (err: Error, user: User, info) => {
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

        if (roles === Roles.User) {
            if (user.role !== Roles.Admin && req.params.userId !== user.id.toString()) {
                return next(Boom.forbidden("Forbidden area"));
            }
        } else if (!roles.includes(user.role)) {
            return next(Boom.forbidden("Forbidden area"));
        } else if (err || !user) {
            return next(Boom.badRequest(err.message));
        }

        req.user = user;

        return next();
    }
}
