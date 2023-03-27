import { singleton } from '@triptyk/nfw-core';
import type { ResourceSchema, SchemaAttributes } from 'resources';
import { UserResource } from './resource.js';

@singleton()
export class UserResourceSchema implements ResourceSchema<UserResource> {
  attributes: SchemaAttributes<UserResource> = ['firstName', 'role', 'lastName', 'password', 'email'];
  class = UserResource;
  relationships: Partial<Record<keyof UserResource, string>> = {
    documents: 'document'
  };
}
