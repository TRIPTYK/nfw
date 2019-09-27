import * as Passport from "passport";
import Boom from "@hapi/boom";

import { User } from "../models/user.model";
import { promisify } from "util";
import { roles as userRoles } from "./../enums/role.enum";
import { Request , Response } from "express"

/**
 * Check if request has valid token and privileges
 *
 * @param {*} req Request object , as 'any' type because a middleware injects unknown functions for Typescript
 * @param {*} res Response object
 * @param {*} next Next middleware function
 * @param {*} roles
 *
 */
const _handleJWT = (req: any, res: Response, next: Function, roles: any) => async (err : Error, user: User, info) => {

    const error = err || info;

    const logIn = promisify(req.logIn);

    try {
        if (error || !user) throw error;
        await logIn(user, { session: false });
    }
    catch (e) {
        return next(Boom.forbidden(e.message));
    }

    if (roles === userRoles.user)
    {
        if (user.role !== userRoles.admin && req.params.userId !== user.id.toString())
        {
            return next(Boom.forbidden('Forbidden area'));
        }
    }
    else if (!roles.includes(user.role))
    {
        return next(Boom.forbidden('Forbidden area'));
    }
    else if (err || !user)
    {
        return next(Boom.badRequest(err.message));
    }

    req.user = user;

    return next();

};

/**
 * @param roles
 */
const authorize = (roles : userRoles[] = []) => (req : Request, res : Response, next : Function) => Passport.authenticate( 'jwt', { session: false }, _handleJWT(req, res, next, roles) ) (req, res, next);

/**
 * @param service
 * @param scope
 */
const oAuth = (service, scope: any = []) => Passport.authenticate(service, {session: false, scope});

export { authorize, oAuth };