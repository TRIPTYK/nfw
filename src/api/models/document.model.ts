import { Entity, ManyToOne, PrimaryKey, Property, BaseEntity, Enum, ManyToMany } from '@mikro-orm/core';
import { v4 } from 'uuid';
import {MimeTypes} from '../enums/mime-type.enum.js';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'documents'
})
export class DocumentModel extends BaseEntity<any, any> {
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
