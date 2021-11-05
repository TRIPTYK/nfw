import { Entity, ManyToOne, PrimaryKey, Property, BaseEntity, Filter } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { defineAbilityForArticle } from '../abilities/article.js';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'articles',
})
@Filter({ name: 'admin_access', cond: args => {} })
@Filter({ name: 'user_access', cond: args => ({ owner_id: args.user.id }) })
@Filter({ name: 'anonymous_access', cond: args => ({ 1: 0 }) })
export class ArticleModel extends BaseEntity<any, any> implements JsonApiModelInterface {
    public static ability = defineAbilityForArticle;

    @PrimaryKey()
    id: string = v4();

    @Property()
    declare title: string;

    @ManyToOne('UserModel')
    declare owner: UserModel;
}
