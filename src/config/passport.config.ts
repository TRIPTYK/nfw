import { Strategy as JwtStrategy } from "passport-jwt";
import * as BearerStrategy from "passport-http-bearer";
import * as AuthProviders from "./../api/services/auth-providers.service";
import * as User from "./../api/models/user.model";
import { UserRepository } from "./../api/repositories/user.repository";
import { jwtSecret } from "./environment.config";
import { ExtractJwt } from "passport-jwt";

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
const jwt = async (payload, next) => {
  try {
    const userRepository = new UserRepository();
    const user = await userRepository.getRepository().findOne( payload.sub );
    if (user) return next(null, user);
    return next(null, false);
  } 
  catch (error) {
    return next(error, false);
  }
};

/**
 * @param {*} service 
 * 
 * @public
 */
const oAuth = service => async (token, next) => {
  try {
    const userRepository = new UserRepository();
    const userData = await AuthProviders[service](token);
    const user = await userRepository.oAuthLogin(userData);
    return next(null, user);
  } 
  catch (err) {
    return next(err);
  }
};

/**
 * 
 */
const strategies = {
  jwt : new JwtStrategy(jwtOptions, jwt),
  facebook : new BearerStrategy(oAuth('facebook')),
  google : new BearerStrategy(oAuth('google'))
}


export { jwt, oAuth, strategies };