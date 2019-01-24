import * as HttpStatus from "http-status";
import * as Boom from "boom";
import * as Fs from "fs";

import { Document } from "./../models/document.model";
import { Request, Response } from "express";
import { getConnection, Connection, getRepository, getCustomRepository } from "typeorm";
import { typeorm as TypeORM } from "./../../config/environment.config";
import { DocumentRepository } from "./../repositories/document.repository";

/**
 * 
 */
class DocumentController {

  /** */
  connection : Connection;

  /** */
  constructor() { this.connection = getConnection(TypeORM.name); }

  async list (req: Request, res : Response, next: Function) {
    try {
      const repository = getCustomRepository(DocumentRepository);
      const documents = await repository.list(req.query);;
      res.json(documents);
    } 
    catch (e) { next(e); }
  }

  async create(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      let document = new Document(req['file']);
      documentRepository.save(document);
      res.json(document);
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

  async get(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      let document = await documentRepository.findOneOrFail(req.params.documentId);
      res.json(document);
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

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

      res.json(document);
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

  async remove (req: Request, res : Response, next: Function) {

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