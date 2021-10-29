import { UserModel } from '../models/user.model.js';
import { JsonApiRepository } from '../../json-api/repositories/json-api.repository.js';
import { unixTimestamp } from '../utils/date-utils.js';
import Jwt from 'jwt-simple';
import bcrypt from 'bcrypt';

export class UserRepository extends JsonApiRepository<UserModel> {
  public generateAccessToken(user: UserModel, accessExpires: number, secret: string): string {
    const payload = {
      exp: unixTimestamp() + accessExpires * 60,
      iat: unixTimestamp(),
      sub: user.id
    }

    return Jwt.encode(payload, secret, 'HS512');   
  }

  public async hashPassword(user: UserModel, password: string): Promise<UserModel> {
    if (!(user.password && await user.passwordMatches(password))) {
      user.password = await bcrypt.hash(password, 10);
    }
    return user;
  }
}
