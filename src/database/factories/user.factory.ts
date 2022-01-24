import { Factory } from '@mikro-orm/seeder';
// eslint-disable-next-line import/no-named-default
import { UserModel } from '../../api/models/user.model.js';

export class UserFactory extends Factory<UserModel> {
  model = UserModel;

  definition (): Partial<UserModel> {
    return {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
    };
  }
}
