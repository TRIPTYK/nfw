import {
  Entity,
  Property,
  Enum,
  BeforeDelete,
  ManyToMany,
  Collection,
  types
} from '@mikro-orm/core';
import { MimeTypes } from '../../api/enums/mime-type.enum.js';
import * as Fs from 'fs/promises';
import type { UserModel } from './user.model.js';
import { BaseModel } from './base.model.js';

@Entity({
  tableName: 'documents'
})
export class DocumentModel extends BaseModel {
  @Property({
    type: types.string
  })
  declare filename: string;

  @Property({
    type: types.string
  })
  declare originalName: string;

  @Property({
    type: types.string
  })
  declare path: string;

  @Enum({
    items: Object.values(MimeTypes),
    type: types.enum
  })
  declare mimetype: MimeTypes;

  @Property({
    type: types.integer
  })
  declare size: number;

  @ManyToMany({
    entity: 'UserModel',
    mappedBy: 'documents'
  })
    users = new Collection<UserModel>(this);

  @BeforeDelete()
  public removeFromDisk (): Promise<void> {
    return Fs.unlink(this.path);
  }
}
