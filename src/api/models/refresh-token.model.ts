import { Entity, Property, OneToOne } from '@mikro-orm/core';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { BaseModel } from './base.model.js';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'refresh-token',
  customRepository: () => RefreshTokenRepository
})
export class RefreshTokenModel extends BaseModel<RefreshTokenModel> {
  @Property()
  declare token: string;

  @Property()
  declare expires: Date;

  @OneToOne({ entity: 'UserModel', inversedBy: 'refreshToken' })
  declare user: UserModel;
}
