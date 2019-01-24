import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Document } from "./../models/document.model";
import * as Boom from "boom";

/**
 * Create Document and append it to req
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * 
 * @returns {Function}
 *  
 * @public
 * 
 */
const create = (req: Request, res: Response, next: Function) => {
  try {
    const documentRepository = getRepository(Document);
    let document = new Document(req['file']);
    documentRepository.save(document);
    req['doc'] = document;
    return next();
  } 
  catch (e) { return next( Boom.expectationFailed(e.message) ); }
};

export { create };