import type { AnyEntity } from '@mikro-orm/core';
import type {
  Class,
  ControllerContextInterface,
  ResponseHandlerInterface,
} from '@triptyk/nfw-core';
import {
  ControllerContext,
  Args,
  container,
  Ctx,
  injectable,
} from '@triptyk/nfw-core';
import type { JsonApiSerializerInterface } from '../interfaces/serializer.interface.js';
import type { RouterContext } from '@koa/router';
import { Cache } from '../../api/decorators/cache.decorator.js';
import type { ValidatedJsonApiQueryParams } from '../decorators/json-api-params';

@injectable()
export class JsonApiResponsehandler<T extends AnyEntity> implements ResponseHandlerInterface {
  /**
   * Handle-all function to serialize and check returned controller data
   */
  async handle (controllerResponse: T | T[] | undefined | null, @Ctx() ctx: RouterContext, @Args() [serializer]: [Class<JsonApiSerializerInterface<T>>], @ControllerContext() controllerContext: ControllerContextInterface, @Cache('json-api-params') queryParams: ValidatedJsonApiQueryParams | undefined): Promise<void> {
    ctx.response.type = 'application/vnd.api+json';
    /**
     * If still undefined
     */
    if (!controllerResponse) {
      ctx.status = 204;
      ctx.body = undefined;
      return;
    }

    if (controllerContext.controllerAction === 'create') {
      ctx.status = 201;
    }

    let paginationData;
    const serializerInstance = container.resolve(serializer);

    /**
     * Pagination response [T[], number]
     */
    if (queryParams?.page && Array.isArray(controllerResponse) && controllerResponse.length === 2 && typeof controllerResponse[1] === 'number') {
      paginationData = {
        totalRecords: controllerResponse[1],
        pageNumber: queryParams.page.number,
        pageSize: queryParams.page.size,
      };
      controllerResponse = controllerResponse[0];
    }

    /**
     * Serialize with extraData
     */
    ctx.response.body = await serializerInstance.serialize(controllerResponse as T | T[], {
      queryParams,
      url: ctx.url,
      paginationData,
    });
  }
}
