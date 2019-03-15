import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Date } from "./../models/date.model";
import { DateSerializer } from "../serializers/date.serializer";
import { DateRepository } from "./../repositories/date.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class DateController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized date
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(DateRepository);
      const date = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( date.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new date
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Date);
      const date = new Date(req.body.data.attributes);
      const savedDate = await repository.save(date);
      res.status( HttpStatus.CREATED );
      res.json( savedDate.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing date
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Date);
      const date = await repository.findOne(req.params.id);
      repository.merge(date, req.body.data.attributes);
      repository.save(date);
      res.json( date.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get date list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(DateRepository);
      const [dates,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new DateSerializer(req,total).serialize(dates)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete date
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const dateRepository = getRepository(Date);
      const date = await dateRepository.findOne(req.params.id);
      const repository = getRepository(Date);
      await repository.remove(date);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
