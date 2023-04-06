import { delay, inject, singleton } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from 'resources';
import { ResourceFactoryImpl } from 'resources';
import type { UserResource } from './resource.js';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';

@singleton()
export class UserResourceFactory extends ResourceFactoryImpl<UserResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) registry: ResourcesRegistry
  ) {
    super('user', registry);
  }
}
