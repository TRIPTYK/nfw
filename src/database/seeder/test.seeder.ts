import type { EntityManager } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';
import { writeFile, mkdir } from 'fs/promises';
import { Roles } from '../../api/enums/roles.enum.js';
import { UserModel } from '../../api/models/user.model.js';
import type { UserRepository } from '../../api/repositories/user.repository.js';
import { DocumentFactory } from '../factories/document.factory.js';
import { UserFactory } from '../factories/user.factory.js';

export class TestSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    const password = await (em.getRepository(UserModel) as UserRepository).hashPassword('123');
    const user = await new UserFactory(em).createOne({
      id: '12345678910abcdef',
      email: 'amaury@localhost.com',
      password,
      firstName: 'amaury',
      lastName: 'localhost',
      role: Roles.ADMIN,
    });
    const document = new DocumentFactory(em).makeOne({
      id: '123456789',
    });
    await em.persistAndFlush(document);
    document.users = [user] as any;
    await em.persistAndFlush(document);
    const path = document.path.split('/');
    path.pop();
    await mkdir(path.join('/'), { recursive: true });
    await writeFile(document.path, 'sdfhsdkjfsdjkfsdjkfhjskd', 'utf-8');
  }
}
