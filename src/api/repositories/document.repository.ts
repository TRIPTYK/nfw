import * as Boom from "boom";

import { Document } from "../models/document.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of files according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, path, fieldname, filename, size, mimetype }) {
    
    try {
      const repository = getRepository(Document);
      const options = omitBy({ path, fieldname, filename, size, mimetype }, isNil);
      
      const documents = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return documents;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
