import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Abort } from "./../models/abort.model";
import { AbortSerializer } from "../serializers/abort.serializer";
import { AbortRepository } from "./../repositories/abort.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class AbortController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized abort
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(AbortRepository);
      const abort = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( abort.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new abort
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Abort);
      const abort = new Abort(req.body.data.attributes);
      const savedAbort = await repository.save(abort);
      res.status( HttpStatus.CREATED );
      res.json( savedAbort.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing abort
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Abort);
      const abort = await repository.findOne(req.params.id);
      repository.merge(abort, req.body.data.attributes);
      repository.save(abort);
      res.json( abort.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get abort list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(AbortRepository);
      const [aborts,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new AbortSerializer(req,total).serialize(aborts)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete abort
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const abortRepository = getRepository(Abort);
      const abort = await abortRepository.findOne(req.params.id);
      const repository = getRepository(Abort);
      await repository.remove(abort);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
