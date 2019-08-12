import * as AuthProviders from "./../api/services/auth-providers.service";
import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import {UserRepository} from "../api/repositories/user.repository";
import {api, facebook_id, facebook_secret, google_id, google_secret, jwtSecret, url} from "./environment.config";
import {getCustomRepository, getRepository} from "typeorm";
import {User} from "../api/models/user.model";
import {Strategy as FacebookStrategy} from "passport-facebook";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {userRelations} from "../api/enums/json-api/user.enum";

const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};

/**
 * @param {*} payload
 * @param {*} next
 *
 * @public
 */
const jwt = async (payload, next: Function) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(payload.sub, {relations: userRelations});
        if (user) return next(null, user);
        return next(null, false);
    } catch (error) {
        return next(error, false);
    }
};

/**
 * @param {*} service
 *
 * @public
 */
const oAuth = service => async (req, accessToken, refreshToken, profile, cb) => {
    try {
        const userRepository = getCustomRepository(UserRepository);
        const userData = await AuthProviders[service](accessToken, refreshToken, profile, cb);
        const user = await userRepository.oAuthLogin(userData);
        req.user = user;
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
};

/**
 *
 */
const strategies = {
    jwt: new JwtStrategy(jwtOptions, jwt),
    google: new GoogleStrategy({
        clientID: google_id,
        clientSecret: google_secret,
        callbackURL: `${url}/api/${api}/auth/google/callback`,
        passReqToCallback: true
    }, oAuth('google')),
    facebook: new FacebookStrategy({
        clientID: facebook_id,
        clientSecret: facebook_secret,
        callbackURL: `${url}/api/${api}/auth/facebook/callback`,
        passReqToCallback: true
    }, oAuth('facebook'))
};


export {jwt, oAuth, strategies};