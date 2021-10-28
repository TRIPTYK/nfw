import {
  PrimaryKey,
  Entity,
  BaseEntity,
  Property,
  OneToOne
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRepository } from '../repositories/user.repository.js';
import { RefreshTokenModel } from './refresh-token.model.js';

@Entity({
  tableName: 'users',
  customRepository: () => UserRepository
})
export class UserModel extends BaseEntity<any, any> {
  @PrimaryKey()
  id: string = v4();

  @Property()
  declare firstName: string;

  @Property()
  declare lastName: string;

  @Property()
  declare password: string;

  @OneToOne({
    entity: () => RefreshTokenModel,
    mappedBy: 'user'
  })
  declare refreshToken: RefreshTokenModel;


  public generateAccessToken(): string {
    return 'banane';   
  }
}
