import * as Moment from "moment-timezone";
import * as Crypto from "crypto";
import { Boom } from "boom";
import { User } from "./../models/user.model";
import { RefreshToken } from "./../models/refresh-token.model";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {

  /** */
  constructor() { super(); }

  /**
   * 
   * @param user 
   */
  generate(user : User) : RefreshToken {

    try {

      const token   = `${user.id}.${Crypto.randomBytes(40).toString('hex')}`;
      const expires = Moment().add(30, 'days').toDate();
    
      const tokenObject = new RefreshToken( token, user, expires );
  
      this.save(tokenObject);
        
      return tokenObject;
    }
    catch(e)
    {
      throw Boom.expectationFailed(e.message);
    }
    
  }
}
