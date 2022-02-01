import {
  Schema,
  SchemaBase,
  String,
  Enum,
  Number,
  Array,
} from 'fastest-validator-decorators';
import type { MimeTypes } from '../enums/mime-type.enum.js';
import type { UserModel } from '../models/user.model.js';

@Schema()
export class ValidatedDocument extends SchemaBase {
  @Enum()
  public declare mimetype: MimeTypes;

  @Array({ optional: true, items: 'string' })
  public declare users: UserModel[];
}

@Schema()
export class ValidatedDocumentUpdate extends SchemaBase {
  @String({ optional: true })
  public declare filename: string;

  @Enum({ optional: true })
  public declare mimetype: MimeTypes;

  @Number({ convert: true, optional: true })
  public declare size: number;

  @String({ optional: true, items: 'string' })
  public declare users: UserModel[];
}
