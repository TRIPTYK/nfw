import { File } from "./../models/file.model";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { omitBy, isNil } from "lodash";
import { Moment } from "moment-timezone";
import { uuidv4 } from "uuid/v4";

import * as Boom from "boom";

@EntityRepository(File)
export class FileRepository extends Repository<File>  {

  /** */
  constructor() { super(); }

  /**
   * Get one File
   *
   * @param {number} id - The id of the file
   * 
   * @returns {User}
   */
  async one(id: number) {

    try {

      let user = await getRepository(File).findOne(id); 

      if (!user) 
      {
        throw Boom.notFound('File not found');
      }

      return user;
    } 
    catch (e) { throw Boom.expectationFailed(e.message); }
  }

  /**
   * Get a list of files according to current query parameters
   * 
   */
  list({ page = 1, perPage = 30, path, name, size, mime_type }) {
    
    try {
      const repository = getRepository(File);
      const options = omitBy({ path, name, size, mime_type }, isNil);
  
      return repository.find({
        where: options,
        skip: ( page - 1 ) * perPage,
        take: perPage
      });
    }
    catch(e) { throw Boom.expectationFailed(e.message); }
    
  }
}
