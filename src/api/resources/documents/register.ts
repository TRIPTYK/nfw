import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { JsonApiResourceSerializer } from '@triptyk/nfw-resources';
import { DocumentDeserializer } from './deserializer.js';
import type { DocumentResource } from './schema.js';
import { documentSchema } from './schema.js';

export function registerDocument (registry: ResourcesRegistryImpl) {
  registry.register<DocumentResource>('documents', {
    serializer: JsonApiResourceSerializer,
    deserializer: DocumentDeserializer,
    schema: documentSchema
  });
}
