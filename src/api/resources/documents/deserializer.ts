import { inject, injectable, singleton } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';
import { JsonApiResourceDeserializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { DocumentResource } from './schema.js';

@injectable()
export class DocumentDeserializer extends JsonApiResourceDeserializer<DocumentResource> {
  public constructor (
        @inject(ResourcesRegistryImpl) registry: ResourcesRegistry,
  ) {
    super('documents', registry);
  }
}
