import { Entity, PrimaryKey, Property, BaseEntity, Enum, ManyToMany, Filter } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { MimeTypes } from '../enums/mime-type.enum.js';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'documents',
})
@Filter({ name: 'admin_access', cond: args => {} })
@Filter({ name: 'user_access', cond: args => ({ owner_id: args.user.id }) })
@Filter({ name: 'anonymous_access', cond: args => ({ 1: 0 }) })
export class DocumentModel extends BaseEntity<any, any> implements JsonApiModelInterface {
    @PrimaryKey()
    id: string = v4();

    @Property()
    declare filename: string;

    @Property()
    declare originalName: string;

    @Property()
    declare path: string;

    @Enum(() => MimeTypes)
    declare mimetype: MimeTypes;

    @Property()
    declare size: number;

    @ManyToMany('UserModel')
    declare user: UserModel[];
}
