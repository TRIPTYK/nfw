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
export class DocumentSerializer {
    private serializer: JSONAPISerializer;

    constructor () {
      this.serializer = new JSONAPISerializer({
        beforeSerialize (data: any) {
          extractCollections(data);
          return data;
        },
      });

      this.serializer.register('document', {
        whitelist: ['filename', 'originalName', 'mimetype', 'path', 'size'],
        relationships: {
          users: {
            type: 'user',
          },
        },
      });
      this.serializer.register('user', {
        whitelist: ['firstName', 'lastName', 'email'],
      });
    }

    serialize (data: any) {
      return this.serializer.serializeAsync('document', data);
    }
}
