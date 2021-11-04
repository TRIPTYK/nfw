import { Collection } from '@mikro-orm/core';
import { inject, injectable, singleton } from '@triptyk/nfw-core';
import JSONAPISerializer from 'json-api-serializer';
import { URLSearchParams } from 'url';
import { ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { JsonApiSerializerInterface } from '../../json-api/interfaces/serializer.interface.js';
import type { UserModel } from '../models/user.model.js';
import { ConfigurationService } from '../services/configuration.service.js';

const extractCollections = (data: Record<string, any>) => {
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Collection && value.isInitialized()) {
      data[key] = value.getItems();
    }
  }
}

export interface ExtraData {
  queryParams: ValidatedJsonApiQueryParams,
  url: string,
  paginationData: {
    totalRecords: number,
    pageNumber: number,
    pageSize: number,
  },
}

@injectable()
@singleton()
export class UserSerializer implements JsonApiSerializerInterface<UserModel> {
    private serializer: JSONAPISerializer;

    constructor (@inject(ConfigurationService) configurationService: ConfigurationService) {
      const { baseURL } = configurationService.config;

      this.serializer = new JSONAPISerializer({
        beforeSerialize (data: any) {
          extractCollections(data);
          return data;
        },
        links: (data: unknown, extraData: unknown) => {
          const { url } = extraData as ExtraData;

          const entity = data as UserModel;

          const links = {
            self: `${baseURL}/${entity.constructor.name}`,
          } as Record<string, string>;

          return links;
        },
        topLevelMeta: (_data: unknown, extraData: unknown) => {
          const { url, paginationData } = extraData as ExtraData;

          return paginationData;
        },
        topLevelLinks: (_data: unknown, extraData: unknown) => {
          const { url, paginationData } = extraData as ExtraData;

          const links = {
            self: `${url}`,
          } as Record<string, string>;

          if (paginationData) {
            const queryMarkLocation = url.indexOf('?');
            const baseURL = url.substring(0, queryMarkLocation);
            const queryParams = url.substring(queryMarkLocation + 1);

            const lastPage = Math.floor(paginationData.totalRecords / paginationData.pageSize);
            const previousPage = paginationData.pageNumber <= 0 ? 0 : paginationData.pageNumber - 1;
            const nextPage = paginationData.pageNumber >= lastPage ? lastPage : paginationData.pageNumber + 1;

            const firstParsedURL = new URLSearchParams(queryParams);
            const lastParsedURL = new URLSearchParams(queryParams);
            const prevParsedURL = new URLSearchParams(queryParams);
            const nextParsedURL = new URLSearchParams(queryParams);

            firstParsedURL.set('page[number]', '1');
            lastParsedURL.set('page[number]', lastPage.toString());
            prevParsedURL.set('page[number]', previousPage.toString());
            nextParsedURL.set('page[number]', nextPage.toString());

            links.first = `${baseURL}${firstParsedURL}`;
            links.last = `${baseURL}${lastParsedURL}`;
            links.prev = `${baseURL}${prevParsedURL}`;
            links.next = `${baseURL}${nextParsedURL}`;
          }

          return links;
        },
      });

      this.serializer.register('user', {
        whitelist: ['firstName', 'lastName'],
        relationships: {
          articles: {
            type: 'article',
          },
          refreshToken: {
            type: 'refresh-token',
          },
        },
      });
      this.serializer.register('article', {
        whitelist: ['title'],
      });
      this.serializer.register('refresh-token', {
        whitelist: ['token'],
      });
    }

    serialize (data: UserModel[] | UserModel, extraData?: Record<string, unknown>) {
      return this.serializer.serializeAsync('user', data, extraData ?? {} as any);
    }
}
