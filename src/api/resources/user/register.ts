import { container } from '@triptyk/nfw-core';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { UserResourceSerializer } from './serializer.js';
import { UserResourceAdapter } from './adapter.js';
import { UserResourceAuthorizer } from './authorizer.js';
import { UserResourceValidator } from './validator.js';
import { UserResourceDeserializer } from './deserializer.js';
import { UserResourceSchema } from './schema.js';
import { UserResourceFactory } from './factory.js';

export function registerUserResource () {
  const registry = container.resolve(ResourcesRegistryImpl);

  registry.register('user', {
    serializer: UserResourceSerializer,
    schema: UserResourceSchema,
    deserializer: UserResourceDeserializer,
    validator: UserResourceValidator,
    authorizer: UserResourceAuthorizer,
    adapter: UserResourceAdapter,
    factory: UserResourceFactory
  })
}
