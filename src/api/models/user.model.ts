import {
  PrimaryKey,
  Entity,
  BaseEntity,
  Property,
  OneToOne,
  Enum,
  Filter,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Roles } from '../enums/roles.enum.js';
import { UserRepository } from '../repositories/user.repository.js';
import { RefreshTokenModel } from './refresh-token.model.js';
import bcrypt from 'bcrypt';
import { defineAbilityForUser } from '../abilities/user.js';
import type { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';

@Entity({
  tableName: 'users',
  customRepository: () => UserRepository,
})
@Filter({ name: 'admin_access', args: false, cond: args => {} })
@Filter({
  name: 'user_access',
  cond: args => {
    return { id: args.user.id };
  },
})
@Filter({ name: 'anonymous_access', args: false, cond: args => ({ 1: 0 }) })
export class UserModel extends BaseEntity<any, any> implements JsonApiModelInterface {
  public static ability = defineAbilityForUser;

  @PrimaryKey()
    id: string = v4();

  @Property()
  declare firstName: string;

  @Property()
  declare lastName: string;

  @Property()
  declare email: string;

  @Property()
  declare password: string;

  @Enum(() => Roles)
  declare role: Roles;

  @OneToOne({
    entity: () => RefreshTokenModel,
    mappedBy: 'user',
  })
    refreshToken?: RefreshTokenModel;

  public passwordMatches (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
