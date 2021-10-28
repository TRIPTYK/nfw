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

  @OneToMany(() => ArticleModel, article => article.owner)
  declare articles: Collection<ArticleModel>;
}
