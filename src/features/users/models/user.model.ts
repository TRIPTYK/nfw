import type {
  Loaded, Ref
} from '@mikro-orm/core';
import {
  Entity,
  Property,
  OneToOne,
  Enum,
  Collection,
  ManyToMany,
  types,
  Filter,
  wrap
} from '@mikro-orm/core';
import { Roles } from '../enums/roles.enum.js';
import type { RefreshTokenModel } from '../../auth/models/refresh-token.model.js';
import bcrypt from 'bcrypt';
import type { DocumentModel } from './document.model.js';
import { BaseModel } from '../../shared/models/base.model.js';

@Entity({
  tableName: 'users'
})
@Filter({ name: 'truc', cond: { 1: 0 } })
export class UserModel extends BaseModel {
  @Property({
    type: types.string
  })
  declare firstName: string;

  @Property({
    type: types.string
  })
  declare lastName: string;

  @Property({
    type: types.string
  })
  declare email: string;

  @Property({
    type: types.string,
    nullable: true
  })
  declare password?: string;

  @Enum({
    items: Object.values(Roles),
    default: Roles.USER,
    type: types.enum
  })
  declare role: Roles;

  @OneToOne({
    entity: 'RefreshTokenModel',
    mappedBy: 'user',
    nullable: true,
    ref: true
  })
  declare refreshToken?: Ref<RefreshTokenModel>;

  @ManyToMany({
    entity: 'DocumentModel',
    mappedBy: 'users',
    owner: true
  })
    documents = new Collection<DocumentModel>(this);

  public async passwordMatches (password: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(password, this.password);
  }
}

export function serializeUser (user: Loaded<UserModel, never>) {
  return {
    ...wrap(user).toJSON(),
    resourceType: 'users'
  }
}
