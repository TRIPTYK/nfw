import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';
import { Deserializer as JSONAPIDeserializer } from "jsonapi-serializer";

/**
 * Define required members for serialize middleware
 */
interface ISerialize {
  withelist: Array<String>;
  serializer: JSONAPISerializer;
  deserializer: JSONAPIDeserializer;
  serialize: Function;
  deserialize: Function;
}

export { ISerialize };