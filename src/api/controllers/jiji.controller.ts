import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Jiji } from "./../models/jiji.model";
import { JijiSerializer } from "../serializers/jiji.serializer";
import { JijiRepository } from "./../repositories/jiji.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class JijiController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized jiji
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(JijiRepository);
      const jiji = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( jiji.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new jiji
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Jiji);
      const jiji = new Jiji(req.body.data.attributes);
      const savedJiji = await repository.save(jiji);
      res.status( HttpStatus.CREATED );
      res.json( savedJiji.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing jiji
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Jiji);
      const jiji = await repository.findOne(req.params.id);
      repository.merge(jiji, req.body.data.attributes);
      repository.save(jiji);
      res.json( jiji.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get jiji list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(JijiRepository);
      const [jijis,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new JijiSerializer(req,total).serialize(jijis)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete jiji
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const jijiRepository = getRepository(Jiji);
      const jiji = await jijiRepository.findOne(req.params.id);
      const repository = getRepository(Jiji);
      await repository.remove(jiji);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
