import * as Boom from "boom";

import { Artichaud } from "../models/artichaud.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Artichaud)
export class ArtichaudRepository extends Repository<Artichaud>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of artichauds according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Artichaud);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const artichauds = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return artichauds;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
