import { types, Entity, Property, OneToOne } from '@mikro-orm/core';
import type { Ref } from '@mikro-orm/core';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { BaseModel } from '../../shared/models/base.model.js';
import type { UserModel } from '../../users/models/user.model.js';

@Entity({
  tableName: 'refresh-token',
  customRepository: () => RefreshTokenRepository
})
export class RefreshTokenModel extends BaseModel {
  @Property({
    type: types.string
  })
  declare token: string;

  @Property({
    type: types.datetime
  })
  declare expires: Date;

  @OneToOne({ entity: 'UserModel', inversedBy: 'refreshToken', ref: true })
  declare user: Ref<UserModel>;
}
