import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Banane } from "./../models/banane.model";
import { BananeRepository } from "./../repositories/banane.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 * 
 */
export class BananeController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Get serialized banane
   * 
   * @param req Request
   * @param res Response
   * 
   * @public
   */
   
   public async get(req: Request, res : Response) { 
    const repository = getRepository(Banane);
    const banane = await repository.findOneOrFail(req.params.bananeId);
    res.json( banane.whitelist() ); 
  }

  /**
   * Create new banane
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */

  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Banane);
      const banane = new Banane(req.body);
      const savedBanane = await repository.save(banane);
      res.status( HttpStatus.CREATED );
      res.json( savedBanane.whitelist() );
    } 
    catch (e) { next( e.message ); }
  }

  /**
   * Update existing banane
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */

  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Banane);
      const banane = await repository.findOne(req.params.bananeId);
      repository.merge(banane, req.body);
      repository.save(banane);
      res.json( banane.whitelist() );
    }
    catch(e) { next( e.message ); }
    
  };

  /**
   * Get banane list
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
   
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(BananeRepository);
      const bananes = await repository.list(req.query);
      res.json(bananes);
    } 
    catch (e) { next(e); }
  }

  /**
   * Delete banane
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */

  public async remove (req: Request, res : Response, next: Function) {

    try {
      const bananeRepository = getRepository(Banane);
      const banane = await bananeRepository.findOne(req.params.bananeId);
      const repository = getRepository(Banane);
      await repository.remove(banane);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }
    
  }
}
