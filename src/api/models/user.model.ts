import type {
  Ref
} from '@mikro-orm/core';
import {
  Entity,
  Property,
  OneToOne,
  Enum,
  Collection,
  ManyToMany,
  types
} from '@mikro-orm/core';
import { Roles } from '../enums/roles.enum.js';
import { UserRepository } from '../repositories/user.repository.js';
import type { RefreshTokenModel } from './refresh-token.model.js';
import bcrypt from 'bcrypt';
import type { DocumentModel } from './document.model.js';
import { BaseModel } from './base.model.js';

@Entity({
  tableName: 'users',
  customRepository: () => UserRepository
})
export class UserModel extends BaseModel<UserModel> {
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
    type: types.string
  })
  declare password: string;

  @Enum({
    items: Object.values(Roles),
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

    public passwordMatches (password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    }
}
