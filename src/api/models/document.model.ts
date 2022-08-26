import {
  Entity,
  Property,
  Enum,
  BeforeDelete,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { MimeTypes } from '../enums/mime-type.enum.js';
import * as Fs from 'fs/promises';
import type { UserModel } from './user.model.js';
import { BaseModel } from './base.model.js';

@Entity({
  tableName: 'documents',
})
export class DocumentModel extends BaseModel<DocumentModel> {
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
