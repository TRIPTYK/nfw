import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { DocumentDeserializer } from './deserializer.js';
import type { DocumentResource } from './schema.js';
import { documentSchema } from './schema.js';
import { DocumentSerializer } from './serializer.js';

export function registerDocument (registry: ResourcesRegistryImpl) {
  registry.register<DocumentResource>('documents', {
    serializer: DocumentSerializer,
    deserializer: DocumentDeserializer,
    schema: documentSchema
  });
}
