import * as HttpStatus from "http-status";

import { Request, Response } from "express";
import { Track } from "./../models/track.model";
import { TrackSerializer } from "../serializers/track.serializer";
import { TrackRepository } from "./../repositories/track.repository";
import { getRepository, getCustomRepository } from "typeorm";
import { BaseController } from "./base.controller";
const promisify = require('util')

/**
 *
 */
export class TrackController extends BaseController {

  /** */
  constructor() { super(); }


  /**
   * Get serialized track
   *
   * @param req Request
   * @param res Response
   *
   * @public
   */
   public async get(req: Request, res : Response, next : Function) {
    try {
      const repository = getCustomRepository(TrackRepository);
      const track = await repository.jsonAPI_findOne(req,req.params.id);
      res.json( track.whitelist() );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Create new track
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async create (req: Request, res : Response, next: Function) {
    try {
      const repository = getRepository(Track);
      const track = new Track(req.body.data.attributes);
      const savedTrack = await repository.save(track);
      res.status( HttpStatus.CREATED );
      res.json( savedTrack.whitelist() );
    }
    catch (e) { next( e.message ); }
  }



  /**
   * Update existing track
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async update (req: Request, res : Response, next: Function) {

    try {
      const repository = getRepository(Track);
      const track = await repository.findOne(req.params.id);
      repository.merge(track, req.body.data.attributes);
      repository.save(track);
      res.json( track.whitelist() );
    }
    catch(e) { next( e.message ); }

  };



  /**
   * Get track list
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {

    try {
      const repository = getCustomRepository(TrackRepository);
      const [tracks,total] = await Promise.all([repository.jsonAPI_find(req),repository.count()]);
      res.json( new TrackSerializer(req,total).serialize(tracks)  );
    }catch(e) {
      next(e);
    }
  }



  /**
   * Delete track
   *
   * @param req Request
   * @param res Response
   * @param next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const trackRepository = getRepository(Track);
      const track = await trackRepository.findOne(req.params.id);
      const repository = getRepository(Track);
      await repository.remove(track);
      res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    catch(e) { next(e); }

  }

}
