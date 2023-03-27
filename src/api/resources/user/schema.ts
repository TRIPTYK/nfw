import { singleton } from '@triptyk/nfw-core';
import type { ResourceSchema } from 'resources';
import { UserResource } from './resource.js';

@singleton()
export class UserResourceSchema implements ResourceSchema<UserResource> {
  attributes: ['firstName', 'role'] = ['firstName', 'role'];
  class = UserResource;
  relationships: Partial<Record<keyof UserResource, string>> = {
    documents: 'documents'
  };
}
