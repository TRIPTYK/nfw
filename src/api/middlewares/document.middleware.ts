import * as Boom from "boom";
import * as Jimp from "jimp";

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Document } from "./../models/document.model";
import { jimp as JimpConfiguration } from "./../../config/environment.config";
import { imageMimeTypes } from "./../enums/mime-type.enum";
import { DocumentSerializer } from "./../serializers/document.serializer";
import { BaseMiddleware } from "./base.middleware";

/**
 * 
 */
export class DocumentMiddleware extends BaseMiddleware {

  constructor() { super( new DocumentSerializer() ); }

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
  public create = (req: Request, res: Response, next: Function) => {
    try {
      const documentRepository = getRepository(Document);
      let document = new Document(req['file']);
      documentRepository.save(document);
      req['doc'] = document;
      return next();
    } 
    catch (e) { return next( Boom.expectationFailed(e.message) ); }
  };

  /**
   * Resize image according to .env file directives
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
  public resize = async (req: Request, res: Response, next: Function) => {

    try {

      // If image optimization is activated and is image mime type
      if(JimpConfiguration.isActive === 1 && imageMimeTypes.lastIndexOf(req['file'].mimetype) !== -1)
      {
        let destination = req['file'].destination;

        // Read original file
        const image = await Jimp.read(req['file'].path);

        // Clone in 3 files according to 3 sizes
        let xsImage = image.clone(), mdImage = image.clone(), xlImage = image.clone();

        // Resize and write file in server
        xsImage
          .resize(JimpConfiguration.xs, Jimp.AUTO)
          .write( destination + '/xs/' + req['file'].filename, function(err, doc){
            if(err) throw Boom.expectationFailed(err.message);
          });

        mdImage
          .resize(JimpConfiguration.md, Jimp.AUTO)
          .write( destination + '/md/' + req['file'].filename, function(err, doc){
            if(err) throw Boom.expectationFailed(err.message);
          });

        xlImage
          .resize(JimpConfiguration.xl, Jimp.AUTO)
          .write( destination + '/xl/' + req['file'].filename, function(err, doc){
            if(err) throw Boom.expectationFailed(err.message);
          });
      }

      return next();
    } 
    catch (e) { return next( Boom.expectationFailed(e.message) ); }
  };

}