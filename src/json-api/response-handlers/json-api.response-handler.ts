import { BaseEntity, Collection } from '@mikro-orm/core';
import {
  Class,
  container,
  inject,
  injectable,
  ResponseHandlerContext,
  ResponseHandlerInterface
} from '@triptyk/nfw-core';
import { UserSerializer } from '../../api/serializer/user.serializer.js';
import { AclService } from '../../api/services/acl.service.js';
import createHttpErrors from 'http-errors';

const walkCollection = (data: BaseEntity<any, any> | BaseEntity<any, any>[]): void => {
  if (Array.isArray(data)) {
    data.map(() => walkCollection(data));
  }

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Collection && value.isInitialized()) {
      walkCollection(value.getItems());
    }
  }
}

@injectable()
export class JsonApiResponsehandler implements ResponseHandlerInterface {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(AclService) private aclService: AclService) {}

  async handle (controllerResponse: unknown | undefined | null, { ctx, controllerAction, args }: ResponseHandlerContext): Promise<void> {
    if (ctx.request.method === 'GET') {
      controllerAction = 'read';
    }

    try {
      if (Array.isArray(controllerResponse)) {
        controllerResponse.forEach((e) => this.aclService.enforce(ctx.state.currentUser, controllerAction as any, e));
      } else {
        if (controllerResponse && controllerResponse instanceof BaseEntity) {
          this.aclService.enforce(ctx.state.currentUser, controllerAction as any, controllerResponse);
        }
      }
    } catch (e: any) {
      throw createHttpErrors(403, e);
    }

    const [serializer] = args as [Class<UserSerializer>];
    ctx.response.type = 'application/vnd.api+json';
    ctx.response.body = await container.resolve(serializer).serialize(controllerResponse);
  }
}
