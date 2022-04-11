import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  BeforeDelete,
  Filter,
  ManyToMany,
  Collection,
  BaseEntity,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { MimeTypes } from '../enums/mime-type.enum.js';
import { DocumentRepository } from '../repositories/document.repository.js';
import * as Fs from 'fs/promises';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'documents',
  customRepository: () => DocumentRepository,
})
@Filter({ name: 'admin_access', args: false, cond: args => ({}) })
@Filter({ name: 'user_access', args: false, cond: args => ({}) })
@Filter({ name: 'anonymous_access', args: false, cond: args => ({}) })
export class DocumentModel extends BaseEntity<DocumentModel, 'id'> implements JsonApiModelInterface {
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

  @ManyToMany({
    entity: 'UserModel',
    mappedBy: 'documents',
  })
    users = new Collection<UserModel>(this);

  @BeforeDelete()
  public removeFromDisk (): Promise<void> {
    return Fs.unlink(this.path);
  }
}
