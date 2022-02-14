import { Schema, SchemaBase, String, Email } from 'fastest-validator-decorators';
import type { Roles } from '../enums/roles.enum.js';
import type { UserModel } from '../models/user.model';

@Schema(true)
export class ValidatedRegisteredUserBody extends SchemaBase implements Partial<UserModel> {
  @String()
  public declare firstName: string;

  @String()
  public declare lastName: string;

  @Email()
  public declare email: string;

  @String()
  public declare password: string;

  public declare role: Roles;
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
