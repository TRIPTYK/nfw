import { inject, singleton } from '@triptyk/nfw-core';
import type { JsonApiQuery, JsonApiResourcesRegistry } from '@triptyk/nfw-resources';
import { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import type { DocumentResourceAdapter } from '../resources/user/adapter.js';
import type { UserResourceDeserializer } from '../resources/user/deserializer.js';
import type { UserResource } from '../resources/user/resource.js';
import type { UserResourceSerializer } from '../resources/user/serializer.js';
import { JsonApiQueryDecorator } from '../decorators/json-api-query.js';

@singleton()
export class UsersController {
  private deserializer: UserResourceDeserializer;
  private serializer: UserResourceSerializer;
  private adapter: DocumentResourceAdapter;

  public constructor (
    @inject(JsonApiRegistryImpl) public registry: JsonApiResourcesRegistry
  ) {
    const user = registry.get<UserResource>('users');
    this.deserializer = user.deserializer;
    this.serializer = user.serializer;
    this.adapter = user.adapter as DocumentResourceAdapter;
  }

  public async list (@JsonApiQueryDecorator() query: JsonApiQuery) {
    const [resources] = await this.adapter.findAll(query);
    return this.serializer.serializeMany(resources);
  }
}
