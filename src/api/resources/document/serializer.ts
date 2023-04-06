import { delay, inject, singleton } from '@triptyk/nfw-core';
import type { DocumentResource } from './resource.js';
import { JsonApiResourceSerializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { ResourcesRegistry } from 'resources';

@singleton()
export class DocumentResourceSerializer extends JsonApiResourceSerializer<DocumentResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) registry: ResourcesRegistry
  ) {
    super('document', registry);
  }
}
