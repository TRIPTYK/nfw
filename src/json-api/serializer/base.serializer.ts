import type { AnyEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { JSONAPIDocument } from 'json-api-serializer';
import JSONAPISerializer from 'json-api-serializer';
import { URLSearchParams } from 'url';
import type { Configuration } from '../../api/services/configuration.service.js';
import { ConfigurationService } from '../../api/services/configuration.service.js';
import type { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';
import type { JsonApiModelInterface } from '../interfaces/model.interface.js';
import type { JsonApiSerializerInterface } from '../interfaces/serializer.interface.js';
import { modelToName } from '../utils/model-to-name.js';

export interface ExtraData {
  queryParams: ValidatedJsonApiQueryParams,
  url: string,
  paginationData: {
    totalRecords: number,
    pageNumber: number,
    pageSize: number,
  },
}

export abstract class BaseJsonApiSerializer<T>
implements JsonApiSerializerInterface<T> {
  protected serializer: JSONAPISerializer;

  constructor () {
    const baseURL = container.resolve<ConfigurationService<Configuration>>(ConfigurationService).getKey('baseURL');
    this.serializer = new JSONAPISerializer({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeSerialize (data: any) {
        return data;
      },
      links: (data: unknown) => {
        const entity = data as AnyEntity;
        console.log(entity);
        const links = {
          self: `${baseURL}/${modelToName(entity.constructor.name)}/${(entity as Partial<JsonApiModelInterface>).id}`,
        } as Record<string, string>;

        return links;
      },
      topLevelMeta: (_data: unknown, extraData: unknown) => {
        const { paginationData } = extraData as ExtraData;

        return paginationData;
      },
      topLevelLinks: (_data: unknown, extraData: unknown) => {
        const { url, paginationData } = extraData as ExtraData;

        const links = {
          self: url,
        } as Record<string, string>;

        if (paginationData) {
          const queryMarkLocation = url.indexOf('?');
          const baseURL = url.substring(0, queryMarkLocation);
          const queryParams = url.substring(queryMarkLocation + 1);

          const lastPage = Math.floor(
            paginationData.totalRecords / paginationData.pageSize,
          );
          const previousPage =
            paginationData.pageNumber <= 1 ? 1 : paginationData.pageNumber - 1;
          const nextPage =
            paginationData.pageNumber >= lastPage
              ? lastPage
              : paginationData.pageNumber + 1;

          const firstParsedURL = new URLSearchParams(queryParams);
          const lastParsedURL = new URLSearchParams(queryParams);
          const prevParsedURL = new URLSearchParams(queryParams);
          const nextParsedURL = new URLSearchParams(queryParams);

          firstParsedURL.set('page[number]', '1');
          lastParsedURL.set('page[number]', lastPage.toString());
          prevParsedURL.set('page[number]', previousPage.toString());
          nextParsedURL.set('page[number]', nextPage.toString());

          links.first = `${baseURL}?${firstParsedURL}`;
          links.last = `${baseURL}?${lastParsedURL}`;
          links.prev = `${baseURL}?${prevParsedURL}`;
          links.next = `${baseURL}?${nextParsedURL}`;
        }

        return links;
      },
    });
  }

  abstract serialize(
    data: T[] | T,
    extraData?: Record<string, unknown>
  ): Promise<JSONAPIDocument>;
}
