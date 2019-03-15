import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Moartest } from "./../models/moartest.model";
import { MoartestSerializer } from "../serializers/moartest.serializer";
import { MoartestRepository } from "./../repositories/moartest.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class MoartestController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized moartest
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(MoartestRepository);
      const moartest = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( moartest.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new moartest
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Moartest);
      const moartest = new Moartest(req.body.data.attributes);
      const savedMoartest = await repository.save(moartest);
      res.status( HttpStatus.CREATED );
      res.json( savedMoartest.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing moartest
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Moartest);
      const moartest = await repository.findOne(req.params.id);
      repository.merge(moartest, req.body.data.attributes);
      repository.save(moartest);
      res.json( moartest.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get moartest list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(MoartestRepository);
      const [moartests,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new MoartestSerializer(req,total).serialize(moartests)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete moartest
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const moartestRepository = getRepository(Moartest);
      const moartest = await moartestRepository.findOne(req.params.id);
      const repository = getRepository(Moartest);
      await repository.remove(moartest);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
