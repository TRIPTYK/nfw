import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Colde_one } from "./../models/colde_one.model";
import { Colde_oneSerializer } from "../serializers/colde_one.serializer";
import { Colde_oneRepository } from "./../repositories/colde_one.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class Colde_oneController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized colde_one
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(Colde_oneRepository);
      const colde_one = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( colde_one.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new colde_one
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Colde_one);
      const colde_one = new Colde_one(req.body.data.attributes);
      const savedColde_one = await repository.save(colde_one);
      res.status( HttpStatus.CREATED );
      res.json( savedColde_one.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing colde_one
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Colde_one);
      const colde_one = await repository.findOne(req.params.id);
      repository.merge(colde_one, req.body.data.attributes);
      repository.save(colde_one);
      res.json( colde_one.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get colde_one list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(Colde_oneRepository);
      const [colde_ones,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new Colde_oneSerializer(req,total).serialize(colde_ones)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete colde_one
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const colde_oneRepository = getRepository(Colde_one);
      const colde_one = await colde_oneRepository.findOne(req.params.id);
      const repository = getRepository(Colde_one);
      await repository.remove(colde_one);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
