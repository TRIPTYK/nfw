import { singleton } from '@triptyk/nfw-core';
import type { ResourceSchema } from 'resources';
import type { UserResource } from './resource.js';

@singleton()
export class UserResourceSchema implements ResourceSchema<UserResource> {
  attributes: readonly (keyof UserResource)[] = ['name', 'role'];
  relationships: Partial<Record<keyof UserResource, string>> = {
    documents: 'documents'
  };

  type = 'users';
}
