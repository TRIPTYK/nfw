import type { UserModel } from '../models/user.model.js';
import { JsonApiRepository } from '../../json-api/repositories/json-api.repository.js';
import { unixTimestamp } from '../utils/date-utils.js';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UserRepository extends JsonApiRepository<UserModel> {
  public generateAccessToken (user: UserModel, accessExpires: number, secret: string, iss: string, audience: string): string {
    const now = unixTimestamp();
    const payload = {
      exp: now + accessExpires * 60,
      iat: now,
      sub: user.id,
    };

    return Jwt.sign(payload, secret, { algorithm: 'HS512', issuer: iss, notBefore: 0, audience });
  }

  public hashPassword (password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
