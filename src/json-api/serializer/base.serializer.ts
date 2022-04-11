import type { JSONAPIDocument } from 'json-api-serializer';
import JSONAPISerializer from 'json-api-serializer';
import { URLSearchParams } from 'url';
import type { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';
import type { JsonApiSerializerInterface } from '../interfaces/serializer.interface.js';

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
    this.serializer = new JSONAPISerializer({
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
