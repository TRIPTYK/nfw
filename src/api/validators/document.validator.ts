import {
  Schema,
  SchemaBase,
  Enum,
  Array,
  Number,
  String,
} from 'fastest-validator-decorators';
import { MimeTypes } from '../enums/mime-type.enum.js';
import type { UserModel } from '../models/user.model.js';

@Schema()
export class ValidatedDocument extends SchemaBase {
  @Enum({ values: Object.values(MimeTypes) })
  public declare mimetype: MimeTypes;

  @String()
  declare filename: string;

  @String()
  declare originalName: string;

  @String()
  declare path: string;

  @Number()
  declare size: number;

  @Array({ optional: true, items: 'string' })
  public declare users: UserModel[];
}
