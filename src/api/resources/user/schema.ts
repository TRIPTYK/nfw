import { singleton } from '@triptyk/nfw-core';
import type { ResourceSchema, SchemaAttributes, SchemaRelationship } from 'resources';
import { UserResource } from './resource.js';

@singleton()
export class UserResourceSchema implements ResourceSchema<UserResource> {
  attributes: SchemaAttributes<UserResource> = {
    firstName: {
      type: 'string',
      serialize: true,
      deserialize: true
    },
    lastName: {
      type: 'string',
      serialize: true,
      deserialize: true
    },
    role: {
      type: 'string',
      serialize: true,
      deserialize: true
    },
    email: {
      type: 'string',
      serialize: true,
      deserialize: true
    },
    password: {
      type: 'string',
      serialize: false,
      deserialize: true
    }
  };

  class = UserResource;
  relationships: Partial<Record<keyof UserResource, SchemaRelationship>> = {
    documents: {
      type: 'document',
      cardinality: 'has-many',
      serialize: true,
      deserialize: true
    }
  };
}
