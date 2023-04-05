import { delay, inject, singleton } from '@triptyk/nfw-core';
import type { PartialResource, ResourceDeserializer, ResourcesRegistry } from 'resources';
import { deserialize } from 'resources';
import { ResourcesRegistryImpl } from '../registry.js';
import type { UserResource } from './resource.js';

@singleton()
export class UserResourceDeserializer implements ResourceDeserializer<UserResource> {
  public constructor (
    @inject(delay(() => ResourcesRegistryImpl)) private registry: ResourcesRegistry
  ) {

  }

  deserialize (payload: Record<string, unknown>): PartialResource<UserResource> {
    return deserialize(payload, this.registry.getSchemaFor('user'));
  }
}
