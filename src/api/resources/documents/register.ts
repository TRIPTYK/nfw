import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { DocumentDeserializer } from './deserializer.js';
import type { UserResource } from './schema.js';
import { documentSchema } from './schema.js';
import { DocumentSerializer } from './serializer.js';

export function registerDocument (registry: ResourcesRegistryImpl) {
  registry.register<UserResource>('documents', {
    serializer: DocumentSerializer,
    deserializer: DocumentDeserializer,
    schema: documentSchema
  });
}
