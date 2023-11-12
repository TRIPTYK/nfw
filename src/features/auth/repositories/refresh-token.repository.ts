import type { UserModel } from '../../users/models/user.model.js';
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
      this.getEntityManager().remove(oldToken);
    }

    const refreshToken = this.create({
      token,
      user,
      expires
    });

    return refreshToken;
  }
}
