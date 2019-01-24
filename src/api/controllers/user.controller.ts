import { Request, Response } from "express";
import { User } from "./../models/user.model";
import { UserRepository } from "./../repositories/user.repository";
import { getConnection, Connection, getRepository, getCustomRepository } from "typeorm";
import { typeorm as TypeORM } from "./../../config/environment.config";

import * as HttpStatus from "http-status";

export class UserController {
  
  /** */
  connection: Connection;

  /** */
  constructor() { this.connection = getConnection(TypeORM.name); }

  /**
   * Get serialized user
   * 
   * @param {Object} req
   * @param {Object} res
   * 
   * @public
   */
  get(req: Request, res : Response) { res.json( req['locals'].whitelist() ); }

  /**
   * Get logged in user info
   * 
   * @param {Object} req
   * @param {Object} res
   * 
   * @public
   */
  loggedIn (req: Request, res : Response) { res.json( req['user'].whitelist() ) }

  /**
   * Create new user
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @public
   */
  async create (req: Request, res : Response, next: Function) {
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
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @public
   */
  async update (req: Request, res : Response, next: Function) {

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
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @public
   */
  async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(UserRepository);
      const users = await repository.list(req.query);;
      const transformedUsers = users.map(user => user.whitelist());
      res.json(transformedUsers);
    } 
    catch (e) { next(e); }
  }

  /**
   * Delete user
   * @public
   */
  async remove (req: Request, res : Response, next: Function) {

    try {
      const user = req['locals'];
      const repository = getRepository(User);
      await repository.remove(user);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }
    
  }
}
