import { Collection } from '@mikro-orm/core';
import { injectable, singleton } from '@triptyk/nfw-core';
import JSONAPISerializer from 'json-api-serializer';

const extractCollections = (data: Record<string, any>) => {
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Collection && value.isInitialized()) {
      data[key] = value.getItems();
    }
  }
}

@injectable()
@singleton()
export class UserSerializer {
    private serializer: JSONAPISerializer;

    constructor () {
      this.serializer = new JSONAPISerializer({
        beforeSerialize (data: any) {
          extractCollections(data);
          return data;
        }
      });

      this.serializer.register('user', {
        whitelist: ['firstName', 'lastName'],
        relationships: {
          articles: {
            type: 'article'
          },
          refreshToken: {
            type: 'refresh-token'
          }
        }
      });
      this.serializer.register('article', {
        whitelist: ['title']
      });
      this.serializer.register('refresh-token', {
        whitelist: ['token']
      });
    }

    serialize (data: any) {
      return this.serializer.serializeAsync('user', data);
    }
}
