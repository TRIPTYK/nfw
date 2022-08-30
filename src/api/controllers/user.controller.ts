import { container } from '@triptyk/nfw-core';
import type { UserModel } from '../models/user.model.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { Ctx, GET } from '@triptyk/nfw-http';
import type { JsonApiContext, ResourceSerializer } from '@triptyk/nfw-jsonapi';
import { JsonApiGetRelationships, JsonApiGetRelated, JsonApiDelete, JsonApiCreate, JsonApiUpdate, JsonApiGet, createResourceFrom, JsonApiRegistry, JsonApiController, JsonApiList, JsonApiMethod } from '@triptyk/nfw-jsonapi';
import { UserResource } from '../resources/user.resource.js';
import type { RouterContext } from '@koa/router';
import { ValidatedUser, ValidatedUserUpdate } from '../validators/user.validators.js';

@JsonApiController(UserResource, {
  currentUser ({ koaContext }) {
    return koaContext.state.user;
  }
})
export class UsersController {
  @GET('/profile')
  public async profile (@CurrentUser() currentUser: UserModel, @Ctx() ctx: RouterContext) {
    const registry = container.resolve(JsonApiRegistry);
    const meta = registry.getResourceByClassName('UserResource')!;
    const serializer = container.resolve(`serializer:${meta.name}`) as ResourceSerializer<UserModel>;

    /**
     * Creating an empty context
     */
    const context = {
      koaContext: ctx,
      method: JsonApiMethod.GET,
      resource: meta
    } as JsonApiContext<UserModel>;

    return serializer.serialize(createResourceFrom(currentUser.toJSON(), meta, context), context);
  }

  @JsonApiList()
  public list () {}

  @JsonApiGet()
  public get () {}

  @JsonApiCreate({
    validation: ValidatedUser
  })
  public create () {}

  @JsonApiUpdate({
    validation: ValidatedUserUpdate
  })
  public update () {}

  @JsonApiDelete()
  public delete () {}

  @JsonApiGetRelated()
  public related () {}

  @JsonApiGetRelationships()
  public relationships () {}
}
