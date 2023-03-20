import { injectable } from '@triptyk/nfw-core';
import { AbstractResource } from 'resources';
import type { Roles } from '../../enums/roles.enum.js';
import type { DocumentResource } from '../document/resource.js';

@injectable()
export class UserResource extends AbstractResource {
  declare name: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare email: string;
  declare role: Roles;

  declare documents: DocumentResource[];
}
