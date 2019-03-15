import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Sandwich } from "./../models/sandwich.model";
import { SandwichSerializer } from "../serializers/sandwich.serializer";
import { SandwichRepository } from "./../repositories/sandwich.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class SandwichController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized sandwich
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(SandwichRepository);
      const sandwich = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( sandwich.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new sandwich
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Sandwich);
      const sandwich = new Sandwich(req.body.data.attributes);
      const savedSandwich = await repository.save(sandwich);
      res.status( HttpStatus.CREATED );
      res.json( savedSandwich.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing sandwich
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Sandwich);
      const sandwich = await repository.findOne(req.params.id);
      repository.merge(sandwich, req.body.data.attributes);
      repository.save(sandwich);
      res.json( sandwich.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get sandwich list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(SandwichRepository);
      const [sandwichs,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new SandwichSerializer(req,total).serialize(sandwichs)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete sandwich
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const sandwichRepository = getRepository(Sandwich);
      const sandwich = await sandwichRepository.findOne(req.params.id);
      const repository = getRepository(Sandwich);
      await repository.remove(sandwich);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
