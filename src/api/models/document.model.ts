import {
  Entity,
  PrimaryKey,
  Property,
  BaseEntity,
  Enum,
  ManyToMany,
  BeforeDelete,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { MimeTypes } from '../enums/mime-type.enum.js';
import { DocumentRepository } from '../repositories/document.repository.js';
import * as Fs from 'fs/promises';
import type { UserModel } from './user.model.js';

@Entity({
  tableName: 'documents',
  customRepository: () => DocumentRepository,
})
export class DocumentModel
  extends BaseEntity<any, any>
  implements JsonApiModelInterface {
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

  @BeforeDelete()
  public removeFromDisk (): Promise<void> {
    return Fs.unlink(this.path);
  }
}
