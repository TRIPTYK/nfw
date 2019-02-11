import * as Boom from "boom";

import { Amaury } from "../models/amaury.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Amaury)
export class AmauryRepository extends Repository<Amaury>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of amaurys according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Amaury);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const amaurys = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return amaurys;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
