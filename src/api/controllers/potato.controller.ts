import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Potato } from "./../models/potato.model";
import { PotatoSerializer } from "../serializers/potato.serializer";
import { PotatoRepository } from "./../repositories/potato.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class PotatoController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized potato
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(PotatoRepository);
      const potato = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( potato.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new potato
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Potato);
      const potato = new Potato(req.body.data.attributes);
      const savedPotato = await repository.save(potato);
      res.status( HttpStatus.CREATED );
      res.json( savedPotato.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing potato
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Potato);
      const potato = await repository.findOne(req.params.id);
      repository.merge(potato, req.body.data.attributes);
      repository.save(potato);
      res.json( potato.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get potato list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(PotatoRepository);
      const [potatos,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new PotatoSerializer(req,total).serialize(potatos)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete potato
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const potatoRepository = getRepository(Potato);
      const potato = await potatoRepository.findOne(req.params.id);
      const repository = getRepository(Potato);
      await repository.remove(potato);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
