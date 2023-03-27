import { inject, singleton } from '@triptyk/nfw-core';
import { Body, Controller, GET, Param, POST, UseMiddleware } from '@triptyk/nfw-http';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../../database/models/user.model.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';
import type { UserResourceAuthorizer } from '../resources/user/authorizer.js';
import type { UserResourceDeserializer } from '../resources/user/deserializer.js';
import type { UserResourceSerializer } from '../resources/user/serializer.js';
import type { UserResourceValidator } from '../resources/user/validator.js';
import type { ResourcesRegistry } from 'resources';
import { ResourcesRegistryImpl } from '../resources/registry.js';
import type { UserResourceFactory } from '../resources/user/factory.js';
import { Roles } from '../enums/roles.enum.js';
import type { UserResourceAdapter } from '../resources/user/adapter.js';

@singleton()
@Controller({
  routeName: '/users'
})
@UseMiddleware(CurrentUserMiddleware)
export class UsersController {
  private deserializer: UserResourceDeserializer;
  private serializer: UserResourceSerializer;
  private authorizer: UserResourceAuthorizer;
  private validator: UserResourceValidator;
  private factory: UserResourceFactory;

  public constructor (
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry
  ) {
    this.deserializer = registry.getDeserializerFor('user') as UserResourceDeserializer;
    this.validator = registry.getValidatorFor('user') as UserResourceValidator;
    this.serializer = registry.getSerializerFor('user') as UserResourceSerializer;
    this.authorizer = registry.getAuthorizerFor('user') as UserResourceAuthorizer;
    this.factory = registry.getFactoryFor('user') as UserResourceFactory;
  }

  get adapter () {
    return this.registry.getAdapterFor('user') as UserResourceAdapter
  }

  @GET('/:id')
  public async get (
      @Param('id') id: string,
      @CurrentUser() currentUser: UserModel
  ) {
    const resource = await this.adapter.findById(id);
    await this.authorizer.can(currentUser, 'read', resource);
    return this.serializer.serializeOne(resource);
  }

  @POST('/')
  public async create (
    @Body() body: Record<string, unknown>,
    @CurrentUser() currentUser: UserModel
  ) {
    const partialResource = await this.deserializer.deserialize(body);
    const validated = await this.validator.validate(partialResource, 'create');
    const resource = this.factory.create({
      ...validated.result,
      firstName: '1',
      lastName: '1',
      documents: [],
      password: '',
      email: '',
      role: Roles.ADMIN
    });
    await this.authorizer.can(currentUser, 'create', resource);
    await this.adapter.create(resource);
    return this.serializer.serializeOne(resource);
  }
}
