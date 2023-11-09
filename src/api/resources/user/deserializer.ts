import { inject, singleton } from '@triptyk/nfw-core';
import { JsonApiResourceDeserializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';
import type { UserResource } from './schema.js';

@singleton()
export class UsersDeserializer extends JsonApiResourceDeserializer<UserResource> {
  public constructor (
        @inject(ResourcesRegistryImpl) registry: ResourcesRegistry,
  ) {
    super('users', registry);
  }
}
