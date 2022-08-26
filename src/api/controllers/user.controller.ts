import { container, injectable } from '@triptyk/nfw-core';
import type { UserModel } from '../models/user.model.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { Ctx, GET } from '@triptyk/nfw-http';
import type { JsonApiContext, ResourceSerializer } from '@triptyk/nfw-jsonapi';
import { JsonApiGetRelationships, JsonApiGetRelated, JsonApiDelete, JsonApiCreate, JsonApiUpdate, JsonApiGet, createResourceFrom, JsonApiRegistry, JsonApiController, JsonApiList } from '@triptyk/nfw-jsonapi';
import { UserResource } from '../resources/user.resource.js';
import { JsonApiMethod } from '@triptyk/nfw-jsonapi/dist/src/storage/metadata/endpoint.metadata.js';
import type { RouterContext } from '@koa/router';
import { QueryParser } from '@triptyk/nfw-jsonapi/dist/src/query-parser/query-parser.js';

@JsonApiController(UserResource)
@injectable()
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
      resource: meta,
      query: new QueryParser(),
    } as JsonApiContext<UserModel>;

    return serializer.serialize(createResourceFrom(currentUser.toJSON(), meta, context), context);
  }

  @JsonApiList()
  public list () {}

  @JsonApiGet()
  public get () {}

  @JsonApiCreate()
  public create () {}

  @JsonApiUpdate()
  public update () {}

  @JsonApiDelete()
  public delete () {}

  @JsonApiGetRelated()
  public related () {}

  @JsonApiGetRelationships()
  public relationships () {}
}
