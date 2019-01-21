import * as Passport from "passport";
import * as Boom from "boom";

import { User } from "./../models/user.model";
import { ES6Promisify } from "es6-promisify";

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} roles 
 * 
 * @private
 */
const _handleJWT = (req, res, next, roles) => async (err, user, info) => {

  const error = err || info;

  const logIn = ES6Promisify.promisify(req.logIn);

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } 
  catch (e) {
    return next(Boom.badImplementation(e.message));
  }

  if (roles === LOGGED_USER) 
  {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) 
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
 * 
 * @param roles 
 */
const authorize = (roles = User.roles) => (req, res, next) => Passport.authenticate( 'jwt', { session: false }, _handleJWT(req, res, next, roles) )(req, res, next);

/**
 * 
 * @param service 
 */
const oAuth = service => Passport.authenticate(service, { session: false });

export { ADMIN, LOGGED_USER, authorize, oAuth };