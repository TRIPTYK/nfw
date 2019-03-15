import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Water } from "./../models/water.model";
import { WaterSerializer } from "../serializers/water.serializer";
import { WaterRepository } from "./../repositories/water.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class WaterController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized water
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(WaterRepository);
      const water = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( water.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new water
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Water);
      const water = new Water(req.body.data.attributes);
      const savedWater = await repository.save(water);
      res.status( HttpStatus.CREATED );
      res.json( savedWater.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing water
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Water);
      const water = await repository.findOne(req.params.id);
      repository.merge(water, req.body.data.attributes);
      repository.save(water);
      res.json( water.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get water list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(WaterRepository);
      const [waters,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new WaterSerializer(req,total).serialize(waters)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete water
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const waterRepository = getRepository(Water);
      const water = await waterRepository.findOne(req.params.id);
      const repository = getRepository(Water);
      await repository.remove(water);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
