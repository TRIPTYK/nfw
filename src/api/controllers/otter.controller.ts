import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Otter } from "./../models/otter.model";
import { OtterRepository } from "./../repositories/otter.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class OtterController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized otter
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response) {
    const repository = getRepository(Otter);
    const otter = await repository.findOneOrFail(req.params.otterId);
    res.json( otter.whitelist() );
  }



  /**
   * Create new otter
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Otter);
      const otter = new Otter(req.body);
      const savedOtter = await repository.save(otter);
      res.status( HttpStatus.CREATED );
      res.json( savedOtter.whitelist() );
    }
    catch (e) { next( e.message ); }
  }


  /**
   * Update existing otter
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Otter);
      const otter = await repository.findOne(req.params.otterId);
      repository.merge(otter, req.body);
      repository.save(otter);
      res.json( otter.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get otter list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(OtterRepository);
      const otters = await repository.list(req.query);
      res.json(otters);
    }
    catch (e) { next(e); }
  }



  /**
   * Delete otter
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const otterRepository = getRepository(Otter);
      const otter = await otterRepository.findOne(req.params.otterId);
      const repository = getRepository(Otter);
      await repository.remove(otter);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
