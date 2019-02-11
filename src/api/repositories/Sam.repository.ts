import * as Boom from "boom";

import { Sam } from "../models/Sam.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Sam)
export class SamRepository extends Repository<Sam>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of Sams according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Sam);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const Sams = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return Sams;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
