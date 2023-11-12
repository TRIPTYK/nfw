import { inject, singleton } from '@triptyk/nfw-core';
import { JsonApiResourceSerializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';

@singleton()
export class UsersSerializer extends JsonApiResourceSerializer {
  public constructor (
      @inject(ResourcesRegistryImpl) registry: ResourcesRegistry
  ) {
    super(registry);
  }
}
