import {
  Schema,
  Enum,
  Array,
  Number,
  String
} from 'fastest-validator-decorators';
import { MimeTypes } from '../enums/mime-type.enum.js';

@Schema({
  strict: true
})
export class ValidatedDocument {
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
  public declare users: string[];
}
