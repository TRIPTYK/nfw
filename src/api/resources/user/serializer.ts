import { delay, inject, singleton } from '@triptyk/nfw-core';
import { ResourceSerializer, ResourcesRegistry, deserialize, serialize } from 'resources';
import type { UserResource } from './resource.js';
import { ResourcesRegistryImpl } from '../registry.js';

@singleton()
export class UserResourceSerializer implements ResourceSerializer<UserResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) private registry: ResourcesRegistry
  ) {

  }

  serializeOne (resource: UserResource) {
    return serialize(resource as never, this.registry.getSchemaFor('user'));
  }

  serializeMany (resources: UserResource[]): unknown {
    return resources.map((resource) => serialize(resource as never, this.registry.getSchemaFor('user')));
  }
}
