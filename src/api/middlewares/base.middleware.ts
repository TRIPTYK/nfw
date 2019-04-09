import { Request, Response } from "express";
import { BaseSerializer } from "../serializers/base.serializer";

import * as Boom from "boom";
import { fullLog } from "../utils/log.util";

export abstract class BaseMiddleware {

  protected serializer: BaseSerializer;

  constructor(serializer: BaseSerializer) { this.serializer = serializer }

  /**
   * Deserialize a POST-PUT-PATCH-DELETE request
   *
   * @param req Request object
   * @param res Response object
   * @param next Next middleware function
   */
  public deserialize = async(req: Request, _res: Response, next: Function) => {

    try {

      if(['GET','DELETE'].includes(req.method)) return next();
      if(!req.body.data || !req.body.data.attributes) return next();

      let fields = await this.serializer.deserialize(req);

      req.body = {};
       
      for(let key in fields)
      {
        if(key !== 'id') {
          req.body[key] = fields[key];
        }
        else delete req.body[key];
      }

      return next();
    }
    catch (e) { return next(Boom.expectationFailed(e.message)); }
  }
}
