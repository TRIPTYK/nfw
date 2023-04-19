import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { JsonApiResourceDeserializer, JsonApiResourceSerializer } from '@triptyk/nfw-resources';
import { userSchema } from './schema.js';

export function registerUser (registry: ResourcesRegistryImpl) {
  registry.register('users', {
    serializer: JsonApiResourceSerializer,
    deserializer: JsonApiResourceDeserializer,
    schema: userSchema
  });
}
