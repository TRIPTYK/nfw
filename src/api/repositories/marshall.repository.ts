import * as Boom from "boom";

import { Marshall } from "../models/marshall.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Marshall)
export class MarshallRepository extends Repository<Marshall>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of marshalls according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Marshall);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const marshalls = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return marshalls;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
