import { inject, singleton } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';
import { JsonApiResourceSerializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { UserResource } from './schema.js';

@singleton()
export class UsersSerializer extends JsonApiResourceSerializer<UserResource> {
  public constructor (
        @inject(ResourcesRegistryImpl) registry: ResourcesRegistry
  ) {
    super('users', registry);
  }
}
