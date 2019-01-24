import * as HttpStatus from "http-status";

import { User } from "./../models/user.model";
import { RefreshToken } from "./../models/refresh-token.model";
import { Request, Response } from "express";
import { getConnection, Connection, getRepository, getCustomRepository } from "typeorm";
import { UserRepository } from "./../repositories/user.repository";
import { typeorm as TypeORM } from "./../../config/environment.config";
import { generateTokenResponse } from "./../utils/auth.util";

/**
 * 
 */
class AuthController {

  /** */
  connection : Connection ;

  /** */
  constructor() { this.connection = getConnection(TypeORM.name); }

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
      const user = new User(req.body);
      repository.save(user);

      const userTransformed = user.whitelist();
      const token = generateTokenResponse(user, user.token());
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
      const repository = getCustomRepository(UserRepository);
      const { user, accessToken } = await repository.findAndGenerateToken(req.body);
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.whitelist();
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
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.whitelist();
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

      const refreshTokenRepository = getRepository(RefreshToken);
      const userRepository = getCustomRepository(UserRepository);

      const { email, refreshToken } = req.body;
      
      const u = await userRepository.findOne({ email : email });

      const refreshObject = await refreshTokenRepository.find({
        token: refreshToken,
      });
      refreshTokenRepository.remove(refreshObject);

      const { user, accessToken } = await userRepository.findAndGenerateToken({ email, refreshObject });
      const response = generateTokenResponse(user, accessToken);
      return res.json(response);
    } 
    catch (error) {
      return next(error);
    }
  }
};

export { AuthController };