import { inject, injectable } from '@triptyk/nfw-core';
import { ResourcesRegistry, JsonApiResourceSerializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { DocumentResource } from './schema.js';

@injectable()
export class DocumentSerializer extends JsonApiResourceSerializer<DocumentResource> {
  public constructor (
        @inject(ResourcesRegistryImpl) registry: ResourcesRegistry,
  ) {
    super('documents', registry);
  }
}
