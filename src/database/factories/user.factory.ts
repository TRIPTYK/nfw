import { Factory } from '@mikro-orm/seeder';
import { UserModel } from '../models/user.model.js';

export class UserFactory extends Factory<UserModel> {
  model = UserModel;

  definition (): Partial<UserModel> {
    return {
      firstName: '',
      lastName: '',
      password: '',
      email: ''
    };
  }
}
