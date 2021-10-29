import {
  PrimaryKey,
  Entity,
  BaseEntity,
  Property,
  OneToOne,
  OneToMany,
  Collection
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRepository } from '../repositories/user.repository.js';
import { ArticleModel } from './article.model.js';
import { RefreshTokenModel } from './refresh-token.model.js';
import bcrypt from 'bcrypt';

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
  declare email: string;

  @Property()
  declare password: string;

  @OneToOne({
    entity: () => RefreshTokenModel,
    mappedBy: 'user'
  })
  declare refreshToken: RefreshTokenModel;

  @OneToMany(() => ArticleModel, article => article.owner)
  declare articles: Collection<ArticleModel>;


  public passwordMatches(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
