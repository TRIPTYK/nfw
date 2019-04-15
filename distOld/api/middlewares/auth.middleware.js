"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport = require("passport");
const Boom = require("boom");
const es6_promisify_1 = require("es6-promisify");
const role_enum_1 = require("./../enums/role.enum");
const ADMIN = 'admin';
exports.ADMIN = ADMIN;
const LOGGED_USER = 'user';
exports.LOGGED_USER = LOGGED_USER;
/**
 * Check if request has valid token and privileges
 *
 * @param {*} req Request object , as 'any' type because a middleware injects unknown functions for Typescript
 * @param {*} res Response object
 * @param {*} next Next middleware function
 * @param {*} roles
 *
 */
const _handleJWT = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info;
    const logIn = es6_promisify_1.promisify(req.logIn);
    try {
        if (error || !user)
            throw error;
        await logIn(user, { session: false });
    }
    catch (e) {
        return next(Boom.forbidden(e.message));
    }
    if (roles === LOGGED_USER) {
        if (user.role !== 'admin' && req.params.userId !== user.id.toString()) {
            return next(Boom.forbidden('Forbidden area'));
        }
    }
    else if (!roles.includes(user.role)) {
        return next(Boom.forbidden('Forbidden area'));
    }
    else if (err || !user) {
        return next(Boom.badRequest(err.message));
    }
    req.user = user;
    return next();
};
/**
 * @param roles
 */
const authorize = (roles = role_enum_1.roles) => (req, res, next) => Passport.authenticate('jwt', { session: false }, _handleJWT(req, res, next, roles))(req, res, next);
exports.authorize = authorize;
/**
 * @param service
 */
const oAuth = service => Passport.authenticate(service, { session: false });
exports.oAuth = oAuth;
