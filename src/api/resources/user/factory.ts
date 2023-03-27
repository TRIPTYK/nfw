import { delay, inject, singleton } from '@triptyk/nfw-core';
import type { ResourceFactory, ResourcePojo, ResourcesRegistry } from 'resources';
import { assign } from 'resources';
import { ResourcesRegistryImpl } from '../registry.js';
import { UserResource } from './resource.js';

@singleton()
export class UserResourceFactory implements ResourceFactory<UserResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) private registry: ResourcesRegistry
  ) {

  }

  create (partialResource: ResourcePojo<UserResource>) {
    const user = new UserResource();
    assign(user, partialResource, this.registry);
    return user;
  }
}
