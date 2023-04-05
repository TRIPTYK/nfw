import { container, injectable, singleton } from '@triptyk/nfw-core';
import type { Resource, ResourceAuthorizer, ResourceDeserializer, ResourceFactory, ResourceSchema, ResourceSerializer, ResourcesRegistry, ResourceValidator } from 'resources';
import type { StringKeyOf } from 'type-fest';
import { DocumentResourceAdapter } from './document/adapter.js';
import { DocumentResourceAuthorizer } from './document/authorizer.js';
import { DocumentResourceDeserializer } from './document/deserializer.js';
import { DocumentResourceFactory } from './document/factory.js';
import { DocumentResourceSchema } from './document/schema.js';
import { DocumentResourceSerializer } from './document/serializer.js';
import { DocumentResourceValidator } from './document/validator.js';
import { UserResourceAdapter } from './user/adapter.js';
import { UserResourceAuthorizer } from './user/authorizer.js';
import { UserResourceDeserializer } from './user/deserializer.js';
import { UserResourceFactory } from './user/factory.js';
import { UserResourceSchema } from './user/schema.js';
import { UserResourceSerializer } from './user/serializer.js';
import { UserResourceValidator } from './user/validator.js';

const typeToClass = {
  user: {
    serializer: UserResourceSerializer,
    deserializer: UserResourceDeserializer,
    factory: UserResourceFactory,
    schema: UserResourceSchema,
    authorizer: UserResourceAuthorizer,
    adapter: UserResourceAdapter,
    validator: UserResourceValidator
  },
  document: {
    serializer: DocumentResourceSerializer,
    deserializer: DocumentResourceDeserializer,
    factory: DocumentResourceFactory,
    schema: DocumentResourceSchema,
    authorizer: DocumentResourceAuthorizer,
    adapter: DocumentResourceAdapter,
    validator: DocumentResourceValidator
  }
} as const;

@singleton()
@injectable()
export class ResourcesRegistryImpl implements ResourcesRegistry {
  getSchemaFor<T extends Resource> (type: StringKeyOf<typeof typeToClass>): ResourceSchema<T> {
    return container.resolve(typeToClass[type].schema as never) as never;
  }

  getSerializerFor<T extends Resource> (type: StringKeyOf<typeof typeToClass>): ResourceSerializer<T> {
    return container.resolve(typeToClass[type].serializer as never) as never;
  }

  getAdapterFor (type: StringKeyOf<typeof typeToClass>): object {
    return container.resolve(typeToClass[type].adapter as never) as never;
  }

  getDeserializerFor<T extends Resource> (type: StringKeyOf<typeof typeToClass>): ResourceDeserializer<T> {
    return container.resolve(typeToClass[type].deserializer as never) as never;
  }

  getValidatorFor<T extends Resource> (type: StringKeyOf<typeof typeToClass>): ResourceValidator<T> {
    return container.resolve(typeToClass[type].validator as never) as never;
  }

  getAuthorizerFor<T extends Resource> (type: StringKeyOf<typeof typeToClass>): ResourceAuthorizer<unknown, T, string, unknown> {
    return container.resolve(typeToClass[type].authorizer as never) as never;
  }

  getFactoryFor<T extends Resource> (type: StringKeyOf<typeof typeToClass>): ResourceFactory<T> {
    return container.resolve(typeToClass[type].factory as never) as never;
  }
}
