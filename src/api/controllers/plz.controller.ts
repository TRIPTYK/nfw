import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Plz } from "./../models/plz.model";
import { PlzSerializer } from "../serializers/plz.serializer";
import { PlzRepository } from "./../repositories/plz.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class PlzController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized plz
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(PlzRepository);
      const plz = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( plz.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new plz
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Plz);
      const plz = new Plz(req.body.data.attributes);
      const savedPlz = await repository.save(plz);
      res.status( HttpStatus.CREATED );
      res.json( savedPlz.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing plz
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Plz);
      const plz = await repository.findOne(req.params.id);
      repository.merge(plz, req.body.data.attributes);
      repository.save(plz);
      res.json( plz.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get plz list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(PlzRepository);
      const [plzs,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new PlzSerializer(req,total).serialize(plzs)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete plz
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const plzRepository = getRepository(Plz);
      const plz = await plzRepository.findOne(req.params.id);
      const repository = getRepository(Plz);
      await repository.remove(plz);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
