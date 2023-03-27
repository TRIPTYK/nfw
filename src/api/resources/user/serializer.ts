import { singleton } from '@triptyk/nfw-core';
import type { ResourceSerializer } from 'resources';
import type { UserResource } from './resource.js';

@singleton()
export class UserResourceSerializer implements ResourceSerializer<UserResource> {
  serializeOne (resource: UserResource): unknown {
    return 'serialized';
  }

  serializeMany (): unknown {
    throw new Error('Method not implemented.');
  }
}
