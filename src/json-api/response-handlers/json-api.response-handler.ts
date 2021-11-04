import { BaseEntity, Collection } from '@mikro-orm/core';
import {
  Class,
  container,
  inject,
  injectable,
  ResponseHandlerContext,
  ResponseHandlerInterface,
} from '@triptyk/nfw-core';
import { AclService } from '../../api/services/acl.service.js';
import createHttpErrors from 'http-errors';
import { UserModel } from '../../api/models/user.model.js';
import { EntityAbility } from '../../api/abilities/base.js';
import { JsonApiSerializerInterface } from '../interfaces/serializer.interface.js';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';

type JsonApiPayload<T> = T | T[] | [T[], number];

export interface JsonApiPayloadInterface<T> {
  payload?: JsonApiPayload<T>,
  queryParams: ValidatedJsonApiQueryParams,
}

@injectable()
export class JsonApiResponsehandler<T extends BaseEntity<any, any>> implements ResponseHandlerInterface {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(AclService) private aclService: AclService) {}

  private async walkCollection (data: T | T[], currentUser: UserModel | null | undefined, action: string, walkedBy: Collection<T>[]): Promise<void> {
    if (Array.isArray(data) && data.every((e) => e instanceof BaseEntity)) {
      for (const el of data) {
        await this.walkCollection(el, currentUser, action, walkedBy)
      }
      return;
    }

    if (data instanceof BaseEntity) {
      const ability = (data.constructor as any).ability as EntityAbility<any> | undefined;
      if (!ability) {
        throw new Error(`Ability not defined for ${data.constructor.name}`);
      }
      await this.aclService.enforce(ability, currentUser, action as any, data);
      // eslint-disable-next-line no-unused-vars
      for (const [_key, value] of Object.entries(data)) {
        if (value instanceof Collection && !walkedBy.includes(value) && value.isInitialized()) {
          walkedBy.push(value);
          await this.walkCollection(value.getItems(), currentUser, action, walkedBy);
        } else {
          await this.walkCollection(value, currentUser, action, walkedBy);
        }
      }
    }
  }

  async handle (controllerResponse: JsonApiPayloadInterface<T> | undefined | null, { ctx, controllerAction, args }: ResponseHandlerContext): Promise<void> {
    if (!controllerResponse) {
      return;
    }

    let { payload, queryParams } = controllerResponse;

    if (!payload) {
      return;
    }

    const [serializer] = args as [Class<JsonApiSerializerInterface<T>>];
    let paginationData;
    const serializerInstance = container.resolve(serializer);
    ctx.response.type = 'application/vnd.api+json';

    /**
     * Pagination response [T[], number]
     */
    if (queryParams.page && Array.isArray(payload) && payload.length === 2 && typeof payload[1] === 'number') {
      paginationData = {
        totalRecords: payload[1],
        pageNumber: queryParams.page.number,
        pageSize: queryParams.page.size,
      };
      payload = payload[0];
    }

    if (ctx.method === 'GET') {
      const currentUser = ctx.state.currentUser as UserModel | undefined;
      try {
        await this.walkCollection(payload as T | T[], currentUser, controllerAction, []);
      } catch (e: any) {
        throw createHttpErrors(403, e);
      }
    }
    ctx.response.body = await serializerInstance.serialize(payload as T | T[], {
      queryParams,
      url: ctx.url,
      paginationData,
    });
  }
}
