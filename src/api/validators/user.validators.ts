import {
  Email,
  Schema,
  SchemaBase,
  String,
} from 'fastest-validator-decorators';

@Schema()
export class ValidatedUser extends SchemaBase {
  @String()
  public declare firstName: string;

  @String()
  public declare lastName: string;

  @Email()
  public declare email: string;

  @String()
  public declare password: string;
}

@Schema()
export class ValidatedUserUpdate extends SchemaBase {
  @String()
  public declare id: string;

  @String({ optional: true })
  public declare firstName: string;

  @String({ optional: true })
  public declare lastName: string;

  @Email({ optional: true })
  public declare email: string;

  @String({ optional: true })
  public declare password: string;
}
