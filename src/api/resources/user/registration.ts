import type { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import { UserResourceAdapter } from './adapter.js';
import { UserResourceAuthorizer } from './authorizer.js';
import { UserResourceDeserializer } from './deserializer.js';
import { UserResourceFactory } from './factory.js';
import { UserResource } from './resource.js';
import { UserResourceSchema } from './schema.js';
import { UserResourceSerializer } from './serializer.js';
import { UserResourceValidator } from './validator.js';

export function registerUserResource (registry: JsonApiRegistryImpl) {
  registry.register('users', {
    resourceClass: UserResource,
    factory: UserResourceFactory,
    serializer: UserResourceSerializer,
    deserializer: UserResourceDeserializer,
    adapter: UserResourceAdapter,
    authorizer: UserResourceAuthorizer,
    schema: UserResourceSchema,
    validator: UserResourceValidator
  });
}
