import { UserModel } from '../models/user.model.js';
import { JsonApiRepository } from '../../json-api/repositories/json-api.repository.js';
import { v4 } from 'uuid';
import { unixTimestamp } from '../utils/date-utils.js';
import { RefreshTokenModel } from '../models/refresh-token.model.js';

export class RefreshTokenRepository extends JsonApiRepository<RefreshTokenModel> {
  public async generateRefreshToken(user: UserModel, refreshExpires: number): Promise<string> {
    const token = v4();
    const expires = unixTimestamp() + refreshExpires * 60;
    const refreshToken = this.create({
      token,
      user,
      expires,
    });
    return token;
  }
}
