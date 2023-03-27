import type { ResourceSerializer } from 'resources';
import type { UserResource } from './resource.js';

export class UserResourceSerializer implements ResourceSerializer<UserResource> {
  serializeOne (resource: UserResource): unknown {
    return resource;
  }

  serializeMany (): unknown {
    throw new Error('Method not implemented.');
  }
}
