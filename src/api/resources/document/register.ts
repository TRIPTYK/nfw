import { container } from '@triptyk/nfw-core';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { DocumentResourceAdapter } from './adapter.js';
import { DocumentResourceAuthorizer } from './authorizer.js';
import { DocumentResourceDeserializer } from './deserializer.js';
import { DocumentResourceFactory } from './factory.js';
import { DocumentResourceSchema } from './schema.js';
import { DocumentResourceSerializer } from './serializer.js';
import { DocumentResourceValidator } from './validator.js';

export function registerDocumentResource () {
  const registry = container.resolve(ResourcesRegistryImpl);

  registry.register('document', {
    serializer: DocumentResourceSerializer,
    schema: DocumentResourceSchema,
    deserializer: DocumentResourceDeserializer,
    validator: DocumentResourceValidator,
    authorizer: DocumentResourceAuthorizer,
    adapter: DocumentResourceAdapter,
    factory: DocumentResourceFactory
  })
}
