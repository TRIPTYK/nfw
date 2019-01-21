import * as Moment from "moment-timezone";
import * as Crypto from "crypto";

import { User } from "./../models/user.model";
import { RefreshToken } from "./../models/refresh-token.model";

import { connection } from "./../../config/environment.config";

/**
 * 
 */
export class RefreshTokenRepository {

  constructor () { }

  /**
   * 
   * @param user 
   */
  generate(user : User) {

    try {

      const token   = `${user.id}.${Crypto.randomBytes(40).toString('hex')}`;
      const expires = Moment().add(30, 'days').toDate();
    
      const tokenObject = new RefreshToken( token, user, expires );
  
      connection.then( (con) => con.getRepository(RefreshToken).save(tokenObject) ); // TODO: implements async
        
      return tokenObject;
    }
    catch(e)
    {
      // TODO:
    }
    
  }
}
