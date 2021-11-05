import {
  Schema,
  SchemaBase,
  String,
  Enum,
  Number,
  Array,
} from 'fastest-validator-decorators';
import { MimeTypes } from '../enums/mime-type.enum.js';
import { UserModel } from '../models/user.model.js';

@Schema()
export class ValidatedDocument extends SchemaBase {
  @Enum()
  public mimetype!: MimeTypes;

  @Array({ optional: true, items: 'string' })
  public users!: UserModel[];
}

@Schema()
export class ValidatedDocumentUpdate extends SchemaBase {
  @String({ optional: true })
  public filename!: string;

  @Enum({ optional: true })
  public mimetype!: MimeTypes;

  @Number({ convert: true, optional: true })
  public size!: number;

  @String({ optional: true, items: 'string' })
  public users!: UserModel[];
}
