import * as Passport from "passport";
import * as Boom from "@hapi/boom";

import { User } from "../models/user.model";
import { promisify } from "util";
import { Roles } from "./../enums/role.enum";
import { Request , Response } from "express";

export default class AuthMiddleware {
    public static authorize = (roles: Roles[] = []) => (req: Request, res: Response, next) =>
        Passport.authenticate( "jwt", { session: false }, AuthMiddleware.handleJWT(req, res, next, roles) ) (req, res, next)

    public static oAuth = (service, scope: any = []) => Passport.authenticate(service, {session: false, scope});

    public static handleJWT = (req: any, res: Response, next , roles: any) => async (err: Error, user: User, info) => {
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
