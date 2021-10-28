import { Entity, ManyToOne, PrimaryKey, Property, BaseEntity } from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'articles'
})
export class ArticleModel extends BaseEntity<any, any> {
    @PrimaryKey()
    id: string = v4();

    @Property()
    declare title: string;

    @ManyToOne('UserModel')
    declare owner: UserModel;
}
