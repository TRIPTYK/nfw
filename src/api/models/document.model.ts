import {
  Entity,
  Property,
  Enum,
  BeforeDelete,
  Filter,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import type { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { MimeTypes } from '../enums/mime-type.enum.js';
import { DocumentRepository } from '../repositories/document.repository.js';
import * as Fs from 'fs/promises';
import type { UserModel } from './user.model.js';
import { BaseModel } from './base.model.js';

@Entity({
  tableName: 'documents',
  customRepository: () => DocumentRepository,
})
@Filter({ name: 'admin_access', args: false, cond: args => ({}) })
@Filter({ name: 'user_access', args: false, cond: args => ({}) })
@Filter({ name: 'anonymous_access', args: false, cond: args => ({}) })
export class DocumentModel extends BaseModel<DocumentModel> implements JsonApiModelInterface {
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
