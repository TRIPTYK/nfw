import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Roles } from '../../../api/enums/roles.enum.js';
import { DocumentFactory } from '../../factories/document.factory.js';
import { UserFactory } from '../../factories/user.factory.js';
import { AuthService } from '../../../api/services/auth.service.js';
import { container } from '@triptyk/nfw-core';

/**
 * This is the default seeder for this environment
 */
export class DatabaseSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    const password = await container.resolve(AuthService).hashPassword('123');
    await new UserFactory(em).createOne({
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
    await new UserFactory(em).createOne({
      id: '9876543210',
      email: 'seb@localhost.com',
      password,
      firstName: 'sebastien',
      lastName: 'dutrèsgrosgrosXXXLDuGras',
      role: Roles.USER,
      documents: new DocumentFactory(em).make(1, {
        id: '1234567891012',
        path: 'tests/static/500.png'
      })
    });
  }
}
