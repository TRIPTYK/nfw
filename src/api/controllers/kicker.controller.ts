import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Kicker } from "./../models/kicker.model";
import { KickerSerializer } from "../serializers/kicker.serializer";
import { KickerRepository } from "./../repositories/kicker.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class KickerController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized kicker
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(KickerRepository);
      const kicker = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( kicker.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new kicker
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Kicker);
      const kicker = new Kicker(req.body.data.attributes);
      const savedKicker = await repository.save(kicker);
      res.status( HttpStatus.CREATED );
      res.json( savedKicker.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing kicker
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Kicker);
      const kicker = await repository.findOne(req.params.id);
      repository.merge(kicker, req.body.data.attributes);
      repository.save(kicker);
      res.json( kicker.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get kicker list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(KickerRepository);
      const [kickers,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new KickerSerializer(req,total).serialize(kickers)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete kicker
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const kickerRepository = getRepository(Kicker);
      const kicker = await kickerRepository.findOne(req.params.id);
      const repository = getRepository(Kicker);
      await repository.remove(kicker);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
