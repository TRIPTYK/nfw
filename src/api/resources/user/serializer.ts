import { delay, inject, singleton } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from 'resources';
import type { UserResource } from './resource.js';
import { JsonApiResourceSerializer, ResourcesRegistryImpl } from '@triptyk/nfw-resources';

@singleton()
export class UserResourceSerializer extends JsonApiResourceSerializer<UserResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) registry: ResourcesRegistry
  ) {
    super('user', registry);
  }
}
