import { UserModel } from '../models/user.model.js';
import { JsonApiRepository } from '../../json-api/repositories/json-api.repository.js';
import { unixTimestamp } from '../utils/date-utils.js';
import * as Jwt from 'jwt-simple';

export class UserRepository extends JsonApiRepository<UserModel> {
  public generateAccessToken(user: UserModel, accessExpires: number, secret: string): string {
    const payload = {
      exp: unixTimestamp() + accessExpires * 60,
      iat: unixTimestamp(),
      sub: user.id
    }

    return Jwt.encode(payload, secret);   
  }
}
