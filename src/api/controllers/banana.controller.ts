import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Banana } from "./../models/banana.model";
import { BananaSerializer } from "../serializers/banana.serializer";
import { BananaRepository } from "./../repositories/banana.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class BananaController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized banana
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(BananaRepository);
      const banana = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( banana.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new banana
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Banana);
      const banana = new Banana(req.body.data.attributes);
      const savedBanana = await repository.save(banana);
      res.status( HttpStatus.CREATED );
      res.json( savedBanana.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing banana
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Banana);
      const banana = await repository.findOne(req.params.id);
      repository.merge(banana, req.body.data.attributes);
      repository.save(banana);
      res.json( banana.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get banana list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(BananaRepository);
      const [bananas,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new BananaSerializer(req,total).serialize(bananas)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete banana
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const bananaRepository = getRepository(Banana);
      const banana = await bananaRepository.findOne(req.params.id);
      const repository = getRepository(Banana);
      await repository.remove(banana);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
