import { Factory } from '@mikro-orm/seeder';
import Faker from 'faker';
import { UserModel } from '../../api/models/user.model.js';

export class UserFactory extends Factory<UserModel> {
  model = UserModel;

  definition (faker: typeof Faker): Partial<UserModel> {
    return {
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      password: Faker.internet.password(),
      email: Faker.internet.exampleEmail(),
    };
  }
}
