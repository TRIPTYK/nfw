import type { Collection } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';
import { writeFile, mkdir } from 'fs/promises';
import { Roles } from '../../api/enums/roles.enum.js';
import type { DocumentModel } from '../../api/models/document.model.js';
import { UserModel } from '../../api/models/user.model.js';
import type { UserRepository } from '../../api/repositories/user.repository.js';
import { DocumentFactory } from '../factories/document.factory.js';
import { UserFactory } from '../factories/user.factory.js';

export class TestSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    const password = await (em.getRepository(UserModel) as UserRepository).hashPassword('123');
    const document = await new DocumentFactory(em).createOne({
      id: '123456789',
    });
    await new UserFactory(em).createOne({
      id: '12345678910abcdef',
      email: 'amaury@localhost.com',
      password,
      firstName: 'amaury',
      lastName: 'localhost',
      role: Roles.ADMIN,
      documents: [document] as unknown as Collection<DocumentModel>,
    });
    await new UserFactory(em).createOne({
      id: '9876543210',
      email: 'seb@localhost.com',
      password,
      firstName: 'sebastien',
      lastName: 'dugros',
      role: Roles.USER,
      documents: [document] as unknown as Collection<DocumentModel>,
    });
    const path = document.path.split('/');
    path.pop();
    await mkdir(path.join('/'), { recursive: true });
    await writeFile(document.path, 'sdfhsdkjfsdjkfsdjkfhjskd', 'utf-8');
  }
}
