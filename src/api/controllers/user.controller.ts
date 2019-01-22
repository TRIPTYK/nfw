import { Request, Response } from "express";
import { User } from "./../models/user.model";
import { UserRepository } from "./../repositories/user.repository";

import * as HttpStatus from "http-status";

export class UserController {
  
  /**
   * 
   */
  repository : UserRepository ;

  /**
   * 
   */
  constructor() { this.init(); }

  /** */
  async init() {
    this.repository = new UserRepository();
  }

  /**
   * Get serialized user
   * 
   * @param {Object} req
   * @param {Object} res
   * 
   * @public
   */
  get(req: Request, res : Response) { res.json( req['locals'].user.transform() ) }

  /**
   * Get logged in user info
   * 
   * @param {Object} req
   * @param {Object} res
   * 
   * @public
   */
  loggedIn (req: Request, res : Response) { res.json( req['user'].transform() ) }

  /**
   * Create new user
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @public
   */
  async create (req: Request, res : Response, next) {
    try {
      const user = this.repository.getRepository().create(req.body);
      const savedUser = await this.repository.getRepository().save(user);
      res.status( HttpStatus.CREATED );
      res.json( savedUser[0].transform() );
    } 
    catch (error) {
      next( User.checkDuplicateEmail(error) );
    }
  }

  /**
   * Replace existing user
   * 
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * 
   * @public
   */
  async replace (req: Request, res : Response, next) {
    try {
      const user = await this.repository.getRepository().findOne(req.params.userId);
      this.repository.getRepository().merge(user, req.body);
      this.repository.getRepository().save(user);
      res.json( user.transform() );
    } 
    catch (error) {
      next(User.checkDuplicateEmail(error));
    }
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
  async update (req: Request, res : Response, next) {

    try {
      const user = await this.repository.getRepository().findOne(req.params.userId);
      this.repository.getRepository().merge(user, req.body);
      this.repository.getRepository().save(user);
      res.json( user.transform() );
    }
    catch(e) {
      next(User.checkDuplicateEmail(e));
    }
    
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
  async list (req: Request, res : Response, next) {
    try {
      const users = await this.repository.list(req.query);
      const transformedUsers = users.map(user => user.transform());
      res.json(transformedUsers);
    } 
    catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * @public
   */
  async remove (req: Request, res : Response, next) {

    try {
      const { user } = req['locals'];
      user
        .remove()
        .then( () => res.status(HttpStatus.NO_CONTENT).end() )
        .catch( e => next(e) );
    }
    catch(e) {
      next(e)
    }
    
  }
}
