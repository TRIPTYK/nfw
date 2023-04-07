import { inject, singleton } from '@triptyk/nfw-core';
import { Body, Controller, DELETE, GET, Param, PATCH, POST, UseMiddleware } from '@triptyk/nfw-http';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../../database/models/user.model.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';
import type { UserResourceDeserializer } from '../resources/user/deserializer.js';
import type { UserResourceSerializer } from '../resources/user/serializer.js';
import type { ResourcesRegistry } from 'resources';
import { assign, canOrFail } from 'resources';
import type { UserResourceFactory } from '../resources/user/factory.js';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';

@singleton()
@Controller({
  routeName: '/users'
})
@UseMiddleware(CurrentUserMiddleware)
export class UsersController {
  private deserializer: UserResourceDeserializer;
  private serializer: UserResourceSerializer;
  private factory: UserResourceFactory;

  public constructor (
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry
  ) {
    this.deserializer = registry.getDeserializerFor('user') as UserResourceDeserializer;
    this.serializer = registry.getSerializerFor('user') as UserResourceSerializer;
    this.factory = registry.getFactoryFor('user') as UserResourceFactory;
  }

  @GET('/:id')
  public async get (
      @Param('id') id: string,
      @CurrentUser() currentUser: UserModel
  ) {
    const resource = await this.orm.findById(id);

    // authorizer ...

    return this.serializer.serializeOne(resource);
  }

  @POST('/')
  public async create (
    @Body() body: Record<string, unknown>,
    @CurrentUser() currentUser: UserModel
  ) {
    const partialResource = await this.deserializer.deserialize(body);
    return this.serializer.serializeOne(resource);
  }

  @PATCH('/:id')
  public async update (
    @Body() body: Record<string, unknown>,
    @Param('id') id: string,
    @CurrentUser() currentUser: UserModel
  ) {
    const partialResource = await this.deserializer.deserialize(body);

    const validated = await this.validator.validate(partialResource);

    if (!validated.isValid) {
      throw validated.errors;
    }

    const existingResource = await this.adapter.findById(id);

    assign(existingResource, validated.result, this.registry);

    await canOrFail(this.authorizer, currentUser, 'update', existingResource, {});
    await this.adapter.update(existingResource);

    return this.serializer.serializeOne(existingResource);
  }

  @DELETE('/:id')
  public async delete (
    @Param('id') id: string,
    @CurrentUser() currentUser: UserModel
  ) {
    const existingResource = await this.adapter.findById(id);
    await canOrFail(this.authorizer, currentUser, 'delete', existingResource, {});
    await this.adapter.delete(existingResource);
  }
}
