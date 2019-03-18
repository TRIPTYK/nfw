import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Datetest } from "./../models/datetest.model";
import { DatetestSerializer } from "../serializers/datetest.serializer";
import { DatetestRepository } from "./../repositories/datetest.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class DatetestController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized datetest
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(DatetestRepository);
      const datetest = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( datetest.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new datetest
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Datetest);
      const datetest = new Datetest(req.body.data.attributes);
      const savedDatetest = await repository.save(datetest);
      res.status( HttpStatus.CREATED );
      res.json( savedDatetest.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing datetest
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Datetest);
      const datetest = await repository.findOne(req.params.id);
      repository.merge(datetest, req.body.data.attributes);
      repository.save(datetest);
      res.json( datetest.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get datetest list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(DatetestRepository);
      const [datetests,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new DatetestSerializer(req,total).serialize(datetests)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete datetest
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const datetestRepository = getRepository(Datetest);
      const datetest = await datetestRepository.findOne(req.params.id);
      const repository = getRepository(Datetest);
      await repository.remove(datetest);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
