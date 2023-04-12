import type { UserModel } from '../models/user.model.js';
import { v4 } from 'uuid';
import type { RefreshTokenModel } from '../models/refresh-token.model.js';
import { EntityRepository } from '@mikro-orm/core';

export class RefreshTokenRepository extends EntityRepository<RefreshTokenModel> {
  public async generateRefreshToken (user: UserModel, refreshExpires: number): Promise<RefreshTokenModel> {
    const token = v4();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + (refreshExpires * 60));

    const oldToken = await this.findOne({
      user
    });

    if (oldToken) {
      this.remove(oldToken);
    }

    const refreshToken = this.create({
      token,
      user,
      expires
    });

    return refreshToken;
  }
}
