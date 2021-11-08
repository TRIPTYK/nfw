import { BaseEntity } from '@mikro-orm/core';
import {
  Class,
  container,
  inject,
  injectable,
  ResponseHandlerContext,
  ResponseHandlerInterface,
} from '@triptyk/nfw-core';
import { AclService } from '../../api/services/acl.service.js';
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
   * Handle-all function to serialize and check returned controller data
   */
  async handle (controllerResponse: JsonApiPayloadInterface<T> | undefined | null, { ctx, args }: ResponseHandlerContext): Promise<void> {
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
     * Serialize with extraData
     */
    ctx.response.body = await serializerInstance.serialize(payload as T | T[], {
      queryParams,
      url: ctx.url,
      paginationData,
    });
  }
}
