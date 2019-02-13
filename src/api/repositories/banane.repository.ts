import * as Boom from "boom";

import { Banane } from "../models/banane.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Banane)
export class BananeRepository extends Repository<Banane>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of bananes according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Banane);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const bananes = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return bananes;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
