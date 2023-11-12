import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { container } from '@triptyk/nfw-core';
import { AuthService } from '../../../../../src/features/auth/services/auth.service.js';
import { Roles } from '../../../../../src/features/users/enums/roles.enum.js';
import { DocumentFactory } from '../../../../../src/features/users/factories/document.factory.js';
import { RefreshTokenFactory } from '../../../../../src/features/users/factories/refresh-token.factory.js';
import { UserFactory } from '../../../../../src/features/users/factories/user.factory.js';

export class AuthControllerTestSeeder extends Seeder {
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
    new UserFactory(em).makeOne({
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
    new RefreshTokenFactory(em).makeOne({
      id: '123',
      token: '123',
      user: new UserFactory(em).makeOne({
        role: Roles.ADMIN
      })
    })
  }
}
