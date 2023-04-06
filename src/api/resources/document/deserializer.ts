import { delay, inject, singleton } from '@triptyk/nfw-core';
import type { DocumentResource } from './resource.js';
import { JsonApiResourceDeserializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { ResourcesRegistry } from 'resources';

@singleton()
export class DocumentResourceDeserializer extends JsonApiResourceDeserializer<DocumentResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) registry: ResourcesRegistry
  ) {
    super('document', registry);
  }
}
