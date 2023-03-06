import type { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import { DocumentResourceAdapter } from './adapter.js';
import { DocumentResourceAuthorizer } from './authorizer.js';
import { DocumentResourceDeserializer } from './deserializer.js';
import { DocumentResourceFactory } from './factory.js';
import { DocumentResource } from './resource.js';
import { DocumentResourceSchema } from './schema.js';
import { DocumentResourceSerializer } from './serializer.js';
import { DocumentResourceValidator } from './validator.js';

export function registerDocumentResource (registry: JsonApiRegistryImpl) {
  registry.register('documents', {
    resourceClass: DocumentResource,
    factory: DocumentResourceFactory,
    serializer: DocumentResourceSerializer,
    deserializer: DocumentResourceDeserializer,
    adapter: DocumentResourceAdapter,
    authorizer: DocumentResourceAuthorizer,
    schema: DocumentResourceSchema,
    validator: DocumentResourceValidator
  });
}
