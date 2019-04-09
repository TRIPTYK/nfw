import * as HttpStatus from "http-status";
import * as Boom from "boom";
import * as Fs from "fs";

import { Document } from "./../models/document.model";
import { Request, Response } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import { DocumentRepository } from "./../repositories/document.repository";
import { BaseController } from "./base.controller";
import * as Pluralize from "pluralize";
import { DocumentSerializer } from "../serializers/document.serializer";
import { relations as documentRelations } from "../enums/relations/document.relations";
import { Serializer as JSONAPISerializer } from "jsonapi-serializer";
import { api, env , port, url } from "../../config/environment.config";

/**
 *
 */
class DocumentController extends BaseController {

  /**
   * @constructor
   */
  constructor() { super(); }

  /**
   * Retrieve a list of documents, according to some parameters
   *
   * @param {Object}req Request
   * @param {Object}res Response
   * @param {Function}next Function
   *
   * @public
   */
  public async list (req: Request, res : Response, next: Function) {
    try {
      const repository = getCustomRepository(DocumentRepository);
      const documents = await repository.jsonApiFind(req,documentRelations);
      res.json( new DocumentSerializer().serialize(documents) );
    }
    catch (e) { next(e); }
  }


  /**
   * public async - description
   *
   * @param  {type} req: Request   description
   * @param  {type} res : Response description
   * @param  {type} next: Function description
   * @return {type}                description
   */
   public async relationships (req: Request, res : Response, next: Function) {
     try {
       const docRepository = getCustomRepository(DocumentRepository);
       const tableName = docRepository.metadata.tableName;
       let { documentId , relation } = req.params;
       const serializer = new JSONAPISerializer(relation,{
         topLevelLinks : {
           self : () =>  `${url}/${tableName}s${req.url}`,
           related : () => `${url}/${tableName}s/${documentId}/${Pluralize.plural(relation)}`
         }
       });

       const exists = docRepository.metadata.relations.find(e => [Pluralize.plural(relation),Pluralize.singular(relation)].includes(e.propertyName));

       if (!exists) throw Boom.notFound();

       if (['many-to-one','one-to-one'].includes(exists.relationType))
        relation = Pluralize.singular(relation);

       const user = await docRepository.createQueryBuilder(docRepository.metadata.tableName)
         .leftJoinAndSelect(`${tableName}.${relation}`,relation)
         .select([`${relation}.id`,`${tableName}.id`]) // select minimal informations
         .where({id : documentId})
         .getOne();

       if (!user) throw Boom.notFound();

       res.json( serializer.serialize(user[relation]) );
     }
     catch(e) { next(e); }
   }

  /**
   * Create a new document
   *
   * @param {Object}req Request
   * @param {Object}res Response
   * @param {Function}next Function
   *
   * @public
   */
  public async create(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      let document = new Document(req['file']);
      const saved = await documentRepository.save(document);
      res.json( new DocumentSerializer().serialize(saved) );
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  }

  /**
   * Retrieve one document according to :documentId
   *
   * @param {Object}req Request
   * @param {Object}res Response
   * @param {Function}next Function
   *
   * @public
   */
  public async get(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getCustomRepository(DocumentRepository);
      const document = await documentRepository.jsonApiFindOne(req,req.params.documentId,documentRelations);

      if (!document) throw Boom.notFound('Document not found');

      res.json( new DocumentSerializer().serialize(document) );
    }
    catch(e) { next(e); }
  }

  /**
   * Update one document according to :documentId
   *
   * @param {Object}req Request
   * @param {Object}res Response
   * @param {Function}next Function
   *
   * @public
   */
  async update(req: Request, res: Response, next: Function) {
    try {
      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOne(req.params.documentId);

      if (!document) throw Boom.notFound('Document not found');

      if(req['file'].filename !== document.filename)
      {
        Fs.unlink(document.path.toString(), (err) => {
          if(err) throw Boom.expectationFailed(err.message);
        });
      }

      documentRepository.merge(document, req['file']);
      const saved = await documentRepository.save(document);

      res.json( new DocumentSerializer().serialize(saved) );
    }
    catch(e) { next(e); }
  }

  /**
   * Delete one document according to :documentId
   *
   * @param {Object}req Request
   * @param {Object}res Response
   * @param {Function}next Function
   *
   * @public
   */
  public async remove (req: Request, res : Response, next: Function) {

    try {
      const documentRepository = getRepository(Document);
      const document = await documentRepository.findOne(req.params.documentId);

      if (!document) throw Boom.notFound('Document not found');

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
