import {
  Email,
  Schema,
  SchemaBase,
  String,
} from 'fastest-validator-decorators';

@Schema(true)
export class ValidatedUser extends SchemaBase {
  @String({ optional: true })
  public declare id: string;

  @String({ max: 64 })
  public declare firstName: string;

  @String({ max: 64 })
  public declare lastName: string;

  @String()
  public declare role: string;

  @Email()
  public declare email: string;

  @String()
  public declare password: string;
}

@Schema(true)
export class ValidatedUserUpdate extends SchemaBase {
  @String({ optional: true })
  public declare id: string;

  @String({ optional: true })
  public declare firstName: string;

  @String({ optional: true })
  public declare role: string;

  @String({ optional: true })
  public declare lastName: string;

  @Email({ optional: true })
  public declare email: string;

  @String({ optional: true })
  public declare password: string;

  public declare documents: string[];
}
