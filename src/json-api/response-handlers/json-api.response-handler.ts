import { BaseEntity, Collection } from '@mikro-orm/core';
import {
  Class,
  container,
  inject,
  injectable,
  ResponseHandlerContext,
  ResponseHandlerInterface,
} from '@triptyk/nfw-core';
import { UserSerializer } from '../../api/serializer/user.serializer.js';
import { AclService } from '../../api/services/acl.service.js';
import createHttpErrors from 'http-errors';
import { UserModel } from '../../api/models/user.model.js';

@injectable()
export class JsonApiResponsehandler implements ResponseHandlerInterface {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(AclService) private aclService: AclService) {}

  private walkCollection (data: BaseEntity<any, any> | BaseEntity<any, any>[], currentUser: UserModel | null, action: string, walkedBy: Collection<unknown>[]): void {
    if (Array.isArray(data) && data.every((e) => e instanceof BaseEntity)) {
      for (const el of data) {
        this.walkCollection(el, currentUser, action, walkedBy)
      }
      return;
    }

    if (data instanceof BaseEntity) {
      this.aclService.enforce(currentUser, action as any, data);
      for (const [_key, value] of Object.entries(data)) {
        if (value instanceof Collection && !walkedBy.includes(value) && value.isInitialized()) {
          console.log('pass', value)
          walkedBy.push(value);
          this.walkCollection(value.getItems(), currentUser, action, walkedBy);
        } else {
          this.walkCollection(value, currentUser, action, walkedBy);
        }
      }
    }
  }

  async handle (controllerResponse: BaseEntity<any, any> | (BaseEntity<any, any>)[] | undefined | null, { ctx, controllerAction, args }: ResponseHandlerContext): Promise<void> {
    if (!controllerResponse) {
      return;
    }

    if (ctx.request.method === 'GET') {
      controllerAction = 'read';
    }

    try {
      this.walkCollection(controllerResponse, null, 'read', []);
    } catch (e: any) {
      throw createHttpErrors(403, e);
    }

    const [serializer] = args as [Class<UserSerializer>];
    ctx.response.type = 'application/vnd.api+json';
    ctx.response.body = await container.resolve(serializer).serialize(controllerResponse);
  }
}
