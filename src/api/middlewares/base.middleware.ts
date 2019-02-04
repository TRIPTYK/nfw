import { Request, Response } from "express";
import { BaseSerializer } from "../serializers/base.serializer";

import * as Boom from "boom";

/**
 * 
 */
export abstract class BaseMiddleware {

  /**
   * 
   */
  protected serializer: BaseSerializer;

  /**
   * 
   * @param deserializer 
   */
  constructor(serializer: BaseSerializer) { this.serializer = serializer }

  /**
   * Deserialize
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public deserialize = async(req: Request, res: Response, next: Function) => {

    try {

      if(req.method === 'GET') return next();
      if(!req.body.data || !req.body.data.attributes) return next();

      let fields = await this.serializer.deserialize(req);

      req.body = {};

      for(let key in fields)
      {
        if(key !== 'id') req.body[key] = fields[key];
        else delete req.body[key];
      }

      return next();
    } 
    catch (e) { return next(Boom.expectationFailed(e.message)); }
  }
}