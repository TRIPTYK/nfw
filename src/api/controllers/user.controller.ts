import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { User } from "./../models/user.model";
import { UserRepository } from "./../repositories/user.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
import { UserSerializer } from "../serializers/user.serializer";

/**
 *
 */
export class UserController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Get serialized user
   *
   * @param req Request object
   * @param res Response object
   *
   */
  public get(req: Request, res : Response) { res.json( req['locals'].whitelist() ); }

  /**
   * Get logged in user info
   *
   * @param req Request object
   * @param res Response object
   *
   */
  public loggedIn (req: Request, res : Response) { res.json( req['user'].whitelist() ); }

  /**
   * Create new user
   *
   * @param req Request object
   * @param res Response object
   * @param next Next middleware function
   *
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
   * @param next Next middleware function
   *
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(User);
      const user = await repository.findOne(req.params.userId);
      if(req.body.password === null || req.body.password === ''){
        req.body.password = undefined;
      }
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
   * @param next Next middleware function
   *
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(UserRepository);
      const [users,totalUsers] = await repository.JsonApiRequest(req.query,['documents']).getManyAndCount();

      res.json(  new UserSerializer(req,totalUsers).serialize(users) );
    }
    catch (e) { next(e); }
  }

  /**
   * Delete user
   *
   * @param req Request
   * @param res Response
   * @param next Next middleware function
   *
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
