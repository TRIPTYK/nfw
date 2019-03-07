import { Request, Response } from "express";
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';
import { Deserializer as JSONAPIDeserializer } from "jsonapi-serializer";
import { ISerialize } from "./../interfaces/ISerialize.interface";

import * as Boom from "boom";

export abstract class BaseSerializer implements ISerialize {

  /**
   *
   */
  public type;

  public options: Object;

  /**
   *
   */
  public withelist;

  /**
   *
   */
  public serializer: JSONAPISerializer;

  /**
   *
   */
  public deserializer: JSONAPIDeserializer;

  /**
   *
   * @param type
   * @param whitelist
   */
  constructor(type: String, options: Object) {

    this.type = type;
    //this.withelist = whitelist;

    this.options = options;
    this.options["convertCase"] = "kebab-case";
    this.options["unconvertCase"] = "camelCase";

    this.serializer = new JSONAPISerializer(type, this.options);
    this.deserializer = new JSONAPIDeserializer(this.options);
  }

  /**
   *
   */
  public serialize = (payload) => {
    try {
      let p = this.serializer.serialize(payload);
      return p;
    }
    catch(e) { throw Boom.expectationFailed(e.message) }
  }

  /**
   * Deserialize
   *
   * @param req
   * @param res
   * @param next
   */
  public deserialize = async(req: Request) => {
    try {
      return await this.deserializer.deserialize(req.body);
    }
    catch (e) { throw Boom.expectationFailed(e.message); }
  }
}
