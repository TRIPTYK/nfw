import { injectable, singleton } from '@triptyk/nfw-core';
import JSONAPIDeSerializer from 'json-api-serializer';
import { DocumentSerializer } from '../serializer/document.serializer.js';

@injectable()
@singleton()
export class DocumentDeserializer {
  private deserializer : JSONAPIDeSerializer;

  constructor () {
    this.deserializer = new JSONAPIDeSerializer();
    this.deserializer.register(DocumentSerializer.entityName, {});
  }

  public deserialize (data:any) : any {
    return this.deserializer.deserialize(DocumentSerializer.entityName, data);
  }
}
