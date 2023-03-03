import { Schema, String, Email } from 'fastest-validator-decorators';
import type { UserModel } from '../../database/models/user.model';

@Schema({
  strict: true
})
export class ValidatedRegisteredUserBody implements Partial<UserModel> {
  @String()
  public declare firstName: string;

  @String()
  public declare lastName: string;

  @Email()
  public declare email: string;

  @String()
  public declare password: string;
}

@Schema({
  strict: true
})
export class ValidatedRefreshBody {
  @String()
  public declare refreshToken: string;
}

@Schema({
  strict: true
})
export class ValidatedLoginBody {
  @Email()
  public declare email: string;

  @String()
  public declare password: string;
}
