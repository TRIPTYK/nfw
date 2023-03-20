import { injectable } from '@triptyk/nfw-core';
import { AbstractResource } from 'resources';
import type { UserResource } from '../user/resource.js';

@injectable()
export class DocumentResource extends AbstractResource {
  declare name: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;

  declare writer: UserResource;
}
