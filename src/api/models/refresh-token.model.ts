import { PrimaryKey, Entity, Property, OneToOne, Filter } from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'refresh-token',
  customRepository: () => RefreshTokenRepository,
})
@Filter({ name: 'admin_access', cond: args => {} })
@Filter({
  name: 'user_access',
  args: false,
  cond: args => {
    return {};
  },
})
@Filter({ name: 'anonymous_access', args: false, cond: args => ({}) })
export class RefreshTokenModel implements JsonApiModelInterface {
  @PrimaryKey()
    id: string = v4();

  @Property()
  declare token: string;

  @Property()
  declare expires: Date;

  @OneToOne({ entity: 'UserModel', inversedBy: 'refreshToken' })
  declare user: UserModel;
}
