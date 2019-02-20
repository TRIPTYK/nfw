import * as Boom from "boom";

import { Otter } from "../models/otter.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Otter)
export class OtterRepository extends Repository<Otter>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of otters according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Otter);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const otters = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return otters;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
