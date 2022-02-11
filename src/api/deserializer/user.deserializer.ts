import { injectable, singleton } from '@triptyk/nfw-core';
import JSONAPIDeSerializer from 'json-api-serializer';

@injectable()
@singleton()
export class UserDeserializer {
  private deserializer : JSONAPIDeSerializer;

  constructor () {
    this.deserializer = new JSONAPIDeSerializer();
    this.deserializer.register('user', {
      relationships: {
        documents: {
          type: 'document',
        },
      },
    });
    this.deserializer.register('document');
  }

  public deserialize (data:any) : any {
    return this.deserializer.deserialize('user', data);
  }
}
