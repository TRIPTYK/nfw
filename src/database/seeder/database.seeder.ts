import { EntityManager } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../factories/user.factory.js';

export class DatabaseSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    await new UserFactory(em).create(10);
  }
}
