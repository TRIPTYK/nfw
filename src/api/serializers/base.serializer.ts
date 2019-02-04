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
  constructor(type: String, whitelist: Array<String>) {  

    this.type = type;
    this.withelist = whitelist;
    this.serializer = new JSONAPISerializer(type, {
      id: 'id',
      attributes: whitelist,
      convertCase: "kebab-case",
      unconvertCase: "camelCase"
    });
    this.deserializer = new JSONAPIDeserializer({
      attributes: whitelist,
      convertCase: "kebab-case",
      unconvertCase: "camelCase"
    });
   
  }

  /**
   * 
   */
  public serialize = async (payload) => {
    try {
      return await this.serializer.serialize(payload);
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