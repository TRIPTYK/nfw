import { Schema, SchemaBase, String, Email } from 'fastest-validator-decorators';

@Schema(true)
export class ValidatedRegisteredUserBody extends SchemaBase {
  @String()
  public declare firstName: string;

  @String()
  public declare lastName: string;

  @Email()
  public declare email: string;

  @String()
  public declare password: string;
}

@Schema(true)
export class ValidatedRefreshBody extends SchemaBase {
  @String()
  public declare refreshToken: string;
}

@Schema(true)
export class ValidatedLoginBody extends SchemaBase {
  @Email()
  public declare email: string;

  @String()
  public declare password: string;
}
