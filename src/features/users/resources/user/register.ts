import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { UsersDeserializer } from './deserializer.js';
import type { UserResource } from './schema.js';
import { userSchema } from './schema.js';
import { UsersSerializer } from './serializer.js';

export function registerUser (registry: ResourcesRegistryImpl) {
  registry.register<UserResource>('users', {
    serializer: UsersSerializer,
    deserializer: UsersDeserializer,
    schema: userSchema
  });
}
