import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Roles } from '../../../features/users/enums/roles.enum.js';
import { DocumentFactory } from '../../../features/users/factories/document.factory.js';
import { UserFactory } from '../../../features/users/factories/user.factory.js';
import { RefreshTokenFactory } from '../../../features/users/factories/refresh-token.factory.js';
import { DocumentsControllerTestSeeder } from './seed.js';

/**
 * This is the default seeder for this environment
 * THIS SEEDER ONLY WORKS IN TEST SERVER OR ACCEPTANCE TESTS.
 */
export class DatabaseSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    const password = '$2b$10$sTzX.XuGTMTaHYEnwdcwZe0gduWH1AA1ZKj3qmW3EVNb./QKh4Kbu';
    new UserFactory(em).makeOne({
      id: '12345678910abcdef',
      email: 'amaury@localhost.com',
      password,
      firstName: 'amaury',
      lastName: 'localhost',
      role: Roles.ADMIN,
      documents: new DocumentFactory(em).make(1, {
        id: '1234567891011',
        path: 'tests/static/500.png',
      }),
    });
    new UserFactory(em).makeOne({
      id: '9876543210',
      email: 'seb@localhost.com',
      password,
      firstName: 'sebastien',
      lastName: 'dutrèsgrosgrosXXXLDuGras',
      role: Roles.USER,
      documents: new DocumentFactory(em).make(1, {
        id: '1234567891012',
        path: 'tests/static/500.png',
      }),
    });
    new RefreshTokenFactory(em).makeOne({
      id: '123',
      token: '123',
      user: new UserFactory(em).makeOne({
        role: Roles.ADMIN,
      }),
    })
    return this.call(em, [DocumentsControllerTestSeeder])
  }
}
