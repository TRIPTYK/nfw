import * as HttpStatus from "http-status";
import * as Boom from "boom";

import { User } from "./../models/user.model";
import { RefreshToken } from "./../models/refresh-token.model";
import { Request, Response } from "express";
import { getRepository, getCustomRepository, AdvancedConsoleLogger } from "typeorm";
import { UserRepository } from "./../repositories/user.repository";
import { generateTokenResponse } from "./../utils/auth.util";
import { BaseController } from "./base.controller";

/**
 * 
 */
class AuthController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Create and save a new user
   * 
   * @param req 
   * @param res 
   * @param next 
   * 
   * @return JWT|next
   * 
   * @public
   */
  async register(req: Request, res : Response, next: Function) { 

    try {

      const repository = getRepository(User);
      
      let user = new User(req.body);
      
      await repository.insert(user);

      const userTransformed = user.whitelist();
      const token = await generateTokenResponse(user, user.token());

      res.status(HttpStatus.CREATED);

      return res.json({ token, user: userTransformed });
    } 
    catch (e) {
      return next( User.checkDuplicateEmail(e) );
    }

  }

  /**
   * Login with an existing user or creates a new one if valid accessToken token
   * 
   * @param req 
   * @param res 
   * @param next 
   * 
   * @return JWT|next
   * 
   * @public
   */
  async login(req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(UserRepository);
      const { user, accessToken } = await repository.findAndGenerateToken(req.body);
      const token = await generateTokenResponse(user, accessToken);
      const userTransformed = user.whitelist();
      return res.json({ token, user: userTransformed });
    } 
    catch (e) { return next( Boom.expectationFailed(e.message)); }

  }

  /**
   * Login with an existing user or creates a new one if valid accessToken token
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @return JWT|next
   * 
   * @public
   */
  async oAuth (req: Request, res : Response, next: Function) {
    try {
      const user = req.body;
      const accessToken = user.token();
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.whitelist();
      return res.json({ token, user: userTransformed });
    } 
    catch (e) { return next( Boom.expectation.failed(e.message)); }
  }

  /**
   * Refresh JWT token by RefreshToken removing, and re-creating 
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @return JWT|next
   * 
   * @public
   */
  async refresh(req: Request, res : Response, next: Function) {

    try {

      const refreshTokenRepository = getRepository(RefreshToken);
      const userRepository = getCustomRepository(UserRepository);

      const { token } = req.body;

      const refreshObject = await refreshTokenRepository.findOne({
        where : { token: token.refreshToken }
      });

      if(typeof(refreshObject) === 'undefined') return next(Boom.expectationFailed('RefreshObject cannot be empty'));

      refreshTokenRepository.remove(refreshObject);
      // Get owner user of the token
      const { user, accessToken } = await userRepository.findAndGenerateToken({ email: refreshObject.user.email , refreshObject });;
      const response = await generateTokenResponse(user, accessToken);
 
      return res.json( { token: response } );
    } 
    catch (e) { console.log(e.message); throw next( Boom.expectationFailed(e.message)); }
  }
};

export { AuthController };