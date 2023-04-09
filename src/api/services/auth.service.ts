import { singleton } from '@triptyk/nfw-core';
import { unixTimestamp } from '../utils/date.js';
import * as Jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';

interface AccessTokenGenerationOptions {
  userId: string,
  accessExpires: number,
  secret: string,
  iss: string,
  audience: string,
}

@singleton()
export class AuthService {
  public generateAccessToken ({ userId, accessExpires, secret, iss, audience }: AccessTokenGenerationOptions): string {
    const now = unixTimestamp();
    const payload = {
      exp: now + accessExpires * 60,
      iat: now,
      sub: userId
    };

    return Jwt.sign(payload, secret, { algorithm: 'HS512', issuer: iss, notBefore: 0, audience });
  }

  public hashPassword (password: string): Promise<string> {
    return hash(password, 10);
  }
}
