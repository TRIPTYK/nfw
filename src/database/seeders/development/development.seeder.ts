import type { Collection, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { writeFile, mkdir } from 'fs/promises';
import { Roles } from '../../../api/enums/roles.enum.js';
import type { DocumentModel } from '../../models/document.model.js';
import { DocumentFactory } from '../../factories/document.factory.js';
import { UserFactory } from '../../factories/user.factory.js';
import { container } from '@triptyk/nfw-core';
import { AuthService } from '../../../api/services/auth.service.js';

/**
 * This is the default seeder for this environment
 */
export class DatabaseSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    const password = await container.resolve(AuthService).hashPassword('123');
    const document = await new DocumentFactory(em).createOne({
      id: '123456789'
    });
    await new UserFactory(em).createOne({
      id: '12345678910abcdef',
      email: 'admin@localhost.com',
      password,
      firstName: 'amaury',
      lastName: 'localhost',
      role: Roles.ADMIN,
      documents: [document] as unknown as Collection<DocumentModel>
    });
    await new UserFactory(em).createOne({
      id: '9876543210',
      email: 'seb@localhost.com',
      password,
      firstName: 'sebastien',
      lastName: 'dutrèsgrosgrosXXXLDuGras',
      role: Roles.USER
    });
    const path = document.path.split('/');
    path.pop();
    await mkdir(path.join('/'), { recursive: true });
    await writeFile(document.path, 'sdfhsdkjfsdjkfsdjkfhjskd', 'utf-8');
  }
}
