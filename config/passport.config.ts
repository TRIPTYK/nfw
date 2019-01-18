import { Strategy as JwtStrategy } from "passport-jwt";
import * as BearerStrategy from "passport-http-bearer";
import * as AuthProviders from "./../api/services/auth-providers";

User = require('./../api/models/user.model');

import { jswtSecret } from "./environment.config";
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
    const user = await User.findById(payload.sub);
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
    const userData = await AuthProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return next(null, user);
  } 
  catch (err) {
    return next(err);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));