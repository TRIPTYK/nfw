import { Document } from "../models/document.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

import * as Boom from "boom";

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of files according to current query parameters
   * 
   */
  list({ page = 1, perPage = 30, path, fieldname, filename, size, mimetype }) {
    
    try {
      const repository = getRepository(Document);
      const options = omitBy({ path, fieldname, filename, size, mimetype }, isNil);
  
      return repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
