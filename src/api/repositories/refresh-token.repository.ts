import * as Moment from "moment-timezone";
import * as Crypto from "crypto";
import { Boom } from "boom";

import { User } from "./../models/user.model";
import { RefreshToken } from "./../models/refresh-token.model";

import { Connection, Repository } from "typeorm";
import { connection as DBConnection } from "./../../config/environment.config";
import { IRepository } from "./../interfaces/IRepository.interface";

/**
 * 
 */
export class RefreshTokenRepository implements IRepository {

  /** */
  connection : Connection;

  /**
   * 
   */
  repository : Repository<RefreshToken>;

  /**
   * 
   */
  constructor() { this.init(); }

  /**
   * 
   */
  async init() {
    this.connection = await DBConnection;
    this.repository = this.connection.getRepository(RefreshToken);
  }

  /**
   * 
   */
  getRepository() : Repository<RefreshToken> {
    return this.repository;
  }

  /**
   * 
   * @param user 
   */
  generate(user : User) : RefreshToken {

    try {

      const token   = `${user.id}.${Crypto.randomBytes(40).toString('hex')}`;
      const expires = Moment().add(30, 'days').toDate();
    
      const tokenObject = new RefreshToken( token, user, expires );
  
      this.repository.save(tokenObject);
        
      return tokenObject;
    }
    catch(e)
    {
      throw Boom.badImplementation(e);
    }
    
  }
}
