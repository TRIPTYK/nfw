import * as HttpStatus from "http-status";
import * as Boom from "boom";
import * as Fs from "fs";

import { Document } from "./../models/document.model";
import { Request, Response } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import { DocumentRepository } from "./../repositories/document.repository";
import { BaseController } from "./base.controller";

/**
 * 
 */
class DocumentController extends BaseController {

  /** */
  constructor() { super(); }

  /**
   * Retrieve a list of documents, according to some parameters
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {
    try {
      const repository = getCustomRepository(DocumentRepository);
      const documents = await repository.list(req.query);
      res.json( documents.map(document => document.whitelist()) );
    } 
    catch (e) { next(e); }
  }

  /**
   * Create a new document
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async create(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      let document = new Document(req['file']);
      documentRepository.save(document);
      res.json(document.whitelist());
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

  /**
   * Retrieve one document according to :documentId
   * 
   * @param req Request 
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async get(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      let document = await documentRepository.findOneOrFail(req.params.documentId);
      res.json(document.whitelist());
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

  /**
   * Update one document according to :documentId
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  async update(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOne(req.params.documentId);

      if(req['file'].filename !== document.filename)
      {
        Fs.unlink(document.path.toString(), (err) => {
          if(err) throw Boom.expectationFailed(err.message);
        });
      }

      documentRepository.merge(document, req['file']);
      documentRepository.save(document);

      res.json(document.whitelist());
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

  /**
   * Delete one document according to :documentId
   * 
   * @param req Request 
   * @param res Response
   * @param next Function
   * 
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOne(req.params.documentId);
      Fs.unlink(document.path.toString(), (err) => {
        if(err) throw Boom.expectationFailed(err.message);
        documentRepository.remove(document);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
      });
    }
    catch(e) { next(e); }
    
  }
};

export { DocumentController };