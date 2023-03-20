import { inject, singleton } from '@triptyk/nfw-core';
import type { JsonApiResourcesRegistry } from '@triptyk/nfw-resources';
import { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import type { UserResourceAdapter } from '../resources/user/adapter.js';
import type { UserResourceDeserializer } from '../resources/user/deserializer.js';
import type { UserResourceSerializer } from '../resources/user/serializer.js';
import { Body, Controller, Ctx, GET, Param, PATCH, POST, UseMiddleware } from '@triptyk/nfw-http';
import type { UserResourceAuthorizer } from '../resources/user/authorizer.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../../database/models/user.model.js';
import type { RouterContext } from '@koa/router';
import type { UserResourceValidator } from '../resources/user/validator.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';

@singleton()
@Controller({
  routeName: '/users'
})
@UseMiddleware(CurrentUserMiddleware)
export class UsersController {
  private deserializer: UserResourceDeserializer;
  private serializer: UserResourceSerializer;
  private adapter: UserResourceAdapter;
  private authorizer: UserResourceAuthorizer;
  private validator: UserResourceValidator;

  public constructor (
    @inject(JsonApiRegistryImpl) public registry: JsonApiResourcesRegistry
  ) {
    this.deserializer = registry.getDeserializerFor('users') as UserResourceDeserializer;
    this.validator = registry.getValidatorFor('users') as UserResourceValidator;
    this.serializer = registry.getSerializerFor('users') as UserResourceSerializer;
    this.adapter = registry.getAdapterFor('users') as UserResourceAdapter;
    this.authorizer = registry.getAuthorizerFor('users') as UserResourceAuthorizer;
  }

  @GET('/:id')
  public async get (
      @Param('id') id: string,
      @CurrentUser() currentUser: UserModel,
      @Ctx() routerContext: RouterContext
  ) {
    const resource = await this.adapter.findById(id);
    await this.authorizer.canOrFail(currentUser, 'read', resource, routerContext);
    return this.serializer.serializeOne(resource);
  }

  @POST('/')
  public async create (
    @Body() body: Record<string, unknown>,
    @CurrentUser() currentUser: UserModel,
    @Ctx() routerContext: RouterContext
  ) {
    const resource = await this.deserializer.deserialize(body);
    await this.validator.validate(resource);
    await this.authorizer.canOrFail(currentUser, 'create', resource, routerContext);
    await this.adapter.create(resource);
    return this.serializer.serializeOne(resource);
  }

  @PATCH('/:id')
  public async update (
    @Body() body: Record<string, unknown>,
    @CurrentUser() currentUser: UserModel,
    @Ctx() routerContext: RouterContext
  ) {
    const resource = await this.deserializer.deserialize(body); // ResourceBody
    await this.validator.validate(resource); // ValidatedResource ?
    await this.authorizer.canOrFail(currentUser, 'update', resource, routerContext); // ValidatedResource
    await this.adapter.create(resource); // Resource
    return this.serializer.serializeOne(resource); // Resource
  }
}
