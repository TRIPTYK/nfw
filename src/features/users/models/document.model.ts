import {
  Entity,
  Property,
  Enum,
  BeforeDelete,
  ManyToMany,
  Collection,
  types,
  wrap
} from '@mikro-orm/core';
import { MimeTypes } from '../enums/mime-type.enum.js';
import * as Fs from 'fs/promises';
import type { UserModel } from './user.model.js';
import { BaseModel } from '../../shared/models/base.model.js';

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

export function serializeDocument (document: DocumentModel) {
  return {
    ...wrap(document).toJSON(),
    resourceType: 'documents'
  }
}
