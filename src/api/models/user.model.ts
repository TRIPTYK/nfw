import {
  Entity,
  Property,
  OneToOne,
  Enum,
  Collection,
  ManyToMany,
  Filter
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
    entity: 'RefreshTokenModel',
    mappedBy: 'user',
    nullable: true
  })
    refreshToken?: RefreshTokenModel;

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
