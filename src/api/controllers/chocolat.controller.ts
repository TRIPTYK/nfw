import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Chocolat } from "./../models/chocolat.model";
import { ChocolatSerializer } from "../serializers/chocolat.serializer";
import { ChocolatRepository } from "./../repositories/chocolat.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class ChocolatController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized chocolat
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(ChocolatRepository);
      const chocolat = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( chocolat.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new chocolat
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Chocolat);
      const chocolat = new Chocolat(req.body.data.attributes);
      const savedChocolat = await repository.save(chocolat);
      res.status( HttpStatus.CREATED );
      res.json( savedChocolat.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing chocolat
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Chocolat);
      const chocolat = await repository.findOne(req.params.id);
      repository.merge(chocolat, req.body.data.attributes);
      repository.save(chocolat);
      res.json( chocolat.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get chocolat list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(ChocolatRepository);
      const [chocolats,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new ChocolatSerializer(req,total).serialize(chocolats)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete chocolat
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const chocolatRepository = getRepository(Chocolat);
      const chocolat = await chocolatRepository.findOne(req.params.id);
      const repository = getRepository(Chocolat);
      await repository.remove(chocolat);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
