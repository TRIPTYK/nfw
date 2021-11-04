import { Collection } from '@mikro-orm/core';
import { injectable, singleton } from '@triptyk/nfw-core';
import JSONAPISerializer from 'json-api-serializer';
import { ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { JsonApiSerializerInterface } from '../../json-api/interfaces/serializer.interface.js';
import type { UserModel } from '../models/user.model.js';

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

    constructor () {
      this.serializer = new JSONAPISerializer({
        beforeSerialize (data: any) {
          extractCollections(data);
          return data;
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
