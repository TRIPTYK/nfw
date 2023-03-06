import { injectable } from '@triptyk/nfw-core';
import { AbstractResource } from 'resources';
import type { DocumentResource } from '../document/resource.js';

@injectable()
export class UserResource extends AbstractResource {
  id?: string | undefined;

  declare name: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;

  declare documents: DocumentResource[];
}
