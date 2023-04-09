import { singleton } from '@triptyk/nfw-core';
import type { UserModel } from '../../database/models/user.model.js';
import { unixTimestamp } from '../utils/date-utils.js';
import * as Jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';

@singleton()
export class AuthService {
  public generateAccessToken (user: UserModel, accessExpires: number, secret: string, iss: string, audience: string): string {
    const now = unixTimestamp();
    const payload = {
      exp: now + accessExpires * 60,
      iat: now,
      sub: user.id
    };

    return Jwt.sign(payload, secret, { algorithm: 'HS512', issuer: iss, notBefore: 0, audience });
  }

  public hashPassword (password: string): Promise<string> {
    return hash(password, 10);
  }
}
