import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { User } from "./../models/user.model";
import { UserRepository } from "./../repositories/user.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";

/**
 * 
 */
export class UserController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Get serialized user
   * 
   * @param req Request
   * @param res Response
   * 
   * @public
   */
  public get(req: Request, res : Response) { res.json( req['locals'].whitelist() ); }

  /**
   * Get logged in user info
   * 
   * @param req Request
   * @param res Response
   * 
   * @public
   */
  public loggedIn (req: Request, res : Response) { res.json( req['user'].whitelist() ); }

  /**
   * Create new user
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(User);
      const user = new User(req.body);
      const savedUser = await repository.save(user);
      res.status( HttpStatus.CREATED );
      res.json( savedUser.whitelist() );
    } 
    catch (e) { next( User.checkDuplicateEmail(e) ); }
  }

  /**
   * Update existing user
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(User);
      const user = await repository.findOne(req.params.userId);
      repository.merge(user, req.body);
      repository.save(user);
      res.json( user.whitelist() );
    }
    catch(e) { next( User.checkDuplicateEmail(e) ); }
    
  };

  /**
   * Get user list
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(UserRepository);
      const users = await repository.list(req.query);
      const transformedUsers = users.map(user => user.whitelist());
      res.json(transformedUsers);
    } 
    catch (e) { next(e); }
  }

  /**
   * Delete user
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const user = req['locals'];
      const repository = getRepository(User);
      await repository.remove(user);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { console.log(e.message); next(e); }
    
  }
}
