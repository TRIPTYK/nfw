import { inject, singleton } from '@triptyk/nfw-core';
import { ResourcesRegistry, JsonApiResourceDeserializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { DocumentResource } from './schema.js';

@singleton()
export class DocumentDeserializer extends JsonApiResourceDeserializer<DocumentResource> {
  public constructor (
        @inject(ResourcesRegistryImpl) registry: ResourcesRegistry,
  ) {
    super('documents', registry);
  }
}
