"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BearerStrategy = require("passport-http-bearer");
const AuthProviders = require("./../api/services/auth-providers.service");
const passport_jwt_1 = require("passport-jwt");
const user_repository_1 = require("./../api/repositories/user.repository");
const environment_config_1 = require("./environment.config");
const passport_jwt_2 = require("passport-jwt");
const typeorm_1 = require("typeorm");
const user_model_1 = require("./../api/models/user.model");
const jwtOptions = {
    secretOrKey: environment_config_1.jwtSecret,
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};
/**
 * @param {*} payload
 * @param {*} next
 *
 * @public
 */
const jwt = async (payload, next) => {
    try {
        const userRepository = typeorm_1.getRepository(user_model_1.User);
        const user = await userRepository.findOne(payload.sub);
        if (user)
            return next(null, user);
        return next(null, false);
    }
    catch (error) {
        return next(error, false);
    }
};
exports.jwt = jwt;
/**
 * @param {*} service
 *
 * @public
 */
const oAuth = service => async (token, next) => {
    try {
        const userRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
        const userData = await AuthProviders[service](token);
        const user = await userRepository.oAuthLogin(userData);
        return next(null, user);
    }
    catch (err) {
        return next(err);
    }
};
exports.oAuth = oAuth;
/**
 *
 */
const strategies = {
    jwt: new passport_jwt_1.Strategy(jwtOptions, jwt),
    facebook: new BearerStrategy(oAuth('facebook')),
    google: new BearerStrategy(oAuth('google'))
};
exports.strategies = strategies;
