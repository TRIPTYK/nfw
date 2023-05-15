import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { JsonApiResourceSerializer } from '@triptyk/nfw-resources';
import { UsersDeserializer } from './deserializer.js';
import type { UserResource } from './schema.js';
import { userSchema } from './schema.js';

export function registerUser (registry: ResourcesRegistryImpl) {
  registry.register<UserResource>('users', {
    serializer: JsonApiResourceSerializer,
    deserializer: UsersDeserializer,
    schema: userSchema
  });
}
