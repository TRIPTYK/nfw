import { Entity, ManyToOne, PrimaryKey, Property, BaseEntity } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { defineAbilityForArticle } from '../abilities/article.js';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'articles',
})
export class ArticleModel extends BaseEntity<any, any> {
    public static ability = defineAbilityForArticle;

    @PrimaryKey()
    id: string = v4();

    @Property()
    declare title: string;

    @ManyToOne('UserModel')
    declare owner: UserModel;
}
