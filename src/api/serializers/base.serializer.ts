import { Request, Response } from "express";
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';
import { Deserializer as JSONAPIDeserializer } from "jsonapi-serializer";
import { ISerialize } from "./../interfaces/ISerialize.interface";
import { api, env , port, url } from "../../config/environment.config";

import * as Boom from "boom";

export abstract class BaseSerializer implements ISerialize {

  /**
   *
   */
  public type;

  public options;

  /**
   *
   */
  public static withelist : Array<String> = [];


  /**
   *
   */
  public serializer: JSONAPISerializer;

  /**
   *
   */
  public deserializer: JSONAPIDeserializer;

  protected replacePage : Function = (url : string,newPage : number) : string => {
    return url.replace(/(.*page%5Bnumber%5D=)(?<pageNumber>[0-9]+)(.*)/i,`$1${newPage}$3`);
  };

  /**
   *
   * @param type
   * @param whitelist
   */
  constructor(type: String,attributes : Array<String>,relations : Object = {},dataLinks : Object = {},topLevelLinks : Object = {})  {
    this.type = type;

    this.options = {
      attributes,
      dataLinks : {
        self : (dataSet,data) => {
          return `${url}/api/${api}/${this.type}/${data.id}`;
        }
      },
      topLevelLinks : {

      },
      convertCase : "kebab-case",
      unconvertCase : "camelCase"
    };

    for (let key in topLevelLinks) {
      this.options.topLevelLinks[key] = topLevelLinks[key];
    }

    for (let key in dataLinks) {
      this.options.dataLinks[key] = dataLinks[key];
    }

    for (let key in relations) {
      this.options[key] = relations[key];
    }

    this.serializer = new JSONAPISerializer(type, this.options);
    this.deserializer = new JSONAPIDeserializer(this.options);
  }

  /**
   *
   */
  public serialize = (payload) => {
    try {
      return this.serializer.serialize(payload);
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
  public deserialize = async (req: Request) => {
    try {
      return await this.deserializer.deserialize(req.body);
    }
    catch (e) { throw Boom.expectationFailed(e.message); }
  }
}
