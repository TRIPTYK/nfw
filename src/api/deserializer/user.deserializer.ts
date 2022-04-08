import { injectable, singleton } from '@triptyk/nfw-core';
import JSONAPIDeSerializer from 'json-api-serializer';
import { DocumentSerializer } from '../serializer/document.serializer.js';
import { UserSerializer } from '../serializer/user.serializer.js';

@injectable()
@singleton()
export class UserDeserializer {
  private deserializer : JSONAPIDeSerializer;

  constructor () {
    this.deserializer = new JSONAPIDeSerializer();
    this.deserializer.register(UserSerializer.entityName, {
      relationships: {
        documents: {
          type: DocumentSerializer.entityName,
        },
      },
    });
    this.deserializer.register(DocumentSerializer.entityName);
  }

  public deserialize (data:any) : any {
    return this.deserializer.deserialize(UserSerializer.entityName, data);
  }
}
