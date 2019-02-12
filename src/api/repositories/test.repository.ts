import * as Boom from "boom";

import { Test } from "../models/test.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";

@EntityRepository(Test)
export class TestRepository extends Repository<Test>  {

  /** */
  constructor() { super(); }

  /**
   * Get a list of tests according to current query parameters
   * 
   * @public
   */
  public async list({ page = 1, perPage = 30, /** TODO path, fieldname, filename, size, mimetype **/ }) {
    
    try {
      const repository = getRepository(Test);
      const options = omitBy({ /** TODO implements params path, fieldname, filename, size, mimetype */ }, isNil);
      
      const tests = await repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });

      return tests;
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
