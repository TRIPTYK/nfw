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
  queryParams?: ValidatedJsonApiQueryParams,
}

@injectable()
export class JsonApiResponsehandler<T extends BaseEntity<any, any>> implements ResponseHandlerInterface {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(AclService) private aclService: AclService) {}

  /**
   * Iterate through all objects if the response to check permissions
   * Heavy perf usage
   */
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

  /**
   * Handle-all function to serialize and check returned controller data
   */
  async handle (controllerResponse: JsonApiPayloadInterface<T> | undefined | null, { ctx, controllerAction, args }: ResponseHandlerContext): Promise<void> {
    ctx.response.type = 'application/vnd.api+json';

    /**
     * For lazy developpers, when no response object is passed, we assign the response as the payload of the response object
     */
    if ((Array.isArray(controllerResponse) && controllerResponse.every((e) => e instanceof BaseEntity)) || controllerResponse instanceof BaseEntity) {
      controllerResponse = {
        payload: controllerResponse as T | T[],
      }
    }

    let { payload, queryParams } = controllerResponse ?? {}; // assign empty object as default payload if undefined or null

    /**
     * If still undefined
     */
    if (!payload) {
      ctx.status = 204;
      ctx.body = undefined;
      return;
    }

    const [serializer] = args as [Class<JsonApiSerializerInterface<T>>];
    let paginationData;
    const serializerInstance = container.resolve(serializer);

    /**
     * Pagination response [T[], number]
     */
    if (queryParams?.page && Array.isArray(payload) && payload.length === 2 && typeof payload[1] === 'number') {
      paginationData = {
        totalRecords: payload[1],
        pageNumber: queryParams.page,
        pageSize: queryParams.page.size,
      };
      payload = payload[0];
    }

    /**
     * We check the access of the data in the response, useless in post requests because we could not revert a created entity
     */
    if (ctx.method === 'GET') {
      const currentUser = ctx.state.user as UserModel | undefined;
      try {
        await this.walkCollection(payload as T | T[], currentUser, 'read', []);
      } catch (e: any) {
        /**
         * if not authorized, transform the error to HTTP error
         */
        throw createHttpErrors(403, e);
      }
    }

    /**
     * Serialize with extraData
     */
    ctx.response.body = await serializerInstance.serialize(payload as T | T[], {
      queryParams,
      url: ctx.url,
      paginationData,
    });
  }
}
