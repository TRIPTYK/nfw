import { injectable } from '@triptyk/nfw-core';
import type { Resource } from 'resources';
import type { Roles } from '../../enums/roles.enum.js';
import type { DocumentResource } from '../document/resource.js';

@injectable()
export class UserResource implements Resource {
  type = 'user';
  id?: string | undefined;

  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare email: string;
  declare role: Roles;

  declare documents: DocumentResource[];
}
