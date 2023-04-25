import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { container } from '@triptyk/nfw-core';
import { Roles } from '../../../../../src/api/enums/roles.enum.js';
import { AuthService } from '../../../../../src/api/services/auth.service.js';
import { DocumentFactory } from '../../../../../src/database/factories/document.factory.js';
import { UserFactory } from '../../../../../src/database/factories/user.factory.js';

/**
 * This is the default seeder for this environment
 */
export class UsersControllerTestSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    const password = await container.resolve(AuthService).hashPassword('123');
    new UserFactory(em).makeOne({
      id: '12345678910abcdef',
      email: 'amaury@localhost.com',
      password,
      firstName: 'amaury',
      lastName: 'localhost',
      role: Roles.ADMIN,
      documents: new DocumentFactory(em).make(1, {
        id: '1234567891011',
        path: 'tests/static/500.png'
      })
    });
  }
}
