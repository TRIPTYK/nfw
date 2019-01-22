import * as HttpStatus from "http-status";
import * as Moment from "moment-timezone";

import { User } from "./../models/user.model";
import { UserRepository } from "./../repositories/user.repository";
import { RefreshTokenRepository } from "./../repositories/refresh-token.repository";
import { Request, Response } from "express";
import { jwtExpirationInterval } from "./../../config/environment.config";

/**
 * 
 */
class AuthController {

  /**
   * 
   */
  repository : UserRepository ;

  /**
   * 
   */
  constructor() { this.init(); }
  
  async init() {
    this.repository = new UserRepository();
  }

 /**
   * Build a token response and return it
   *
   * @param {Object} user
   * @param {String} accessToken
   *
   * @returns A formated object with tokens
   *
   * @private
   */
  private _generateTokenResponse(user : User, accessToken : string) {
    const tokenType = 'Bearer';
    const repository = new RefreshTokenRepository();
    const refreshToken = repository.generate(user).token;
    const expiresIn = Moment().add(jwtExpirationInterval, 'minutes');
    return { tokenType, accessToken, refreshToken, expiresIn };
  }

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
      const user = new User(req.body);
      this.repository.getRepository().save(user);

      const userTransformed = user.transform();
      const token = this._generateTokenResponse(user, user.token());
      res.status(HttpStatus.CREATED);
      return res.json({ token, user: userTransformed });
    } 
    catch (error) {
      return next( User.checkDuplicateEmail(error) );
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
      const { user, accessToken } = await this.repository.findAndGenerateToken(req.body);
      const token = this._generateTokenResponse(user, accessToken);
      const userTransformed = user.transform();
      return res.json({ token, user: userTransformed });
    } 
    catch (error) {
      return next(error);
    }

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
      const token = this._generateTokenResponse(user, accessToken);
      const userTransformed = user.transform();
      return res.json({ token, user: userTransformed });
    } 
    catch (error) {
      return next(error);
    }
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

      const refreshTokenRepository = new RefreshTokenRepository();

      const { email, refreshToken } = req.body;
      
      const refreshObject = await refreshTokenRepository.repository.find({
        token: refreshToken,
      });
      refreshTokenRepository.repository.remove(refreshObject);

      const { user, accessToken } = await this.repository.findAndGenerateToken({ email, refreshObject });
      const response = this._generateTokenResponse(user, accessToken);
      return res.json(response);
    } 
    catch (error) {
      return next(error);
    }
  }
};

export { AuthController };