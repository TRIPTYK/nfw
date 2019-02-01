import { Request, Response } from "express";
import * as XSS from "xss";
import * as Boom from "boom";

export class SecurityMiddleware {

  constructor() {}
  
  /**
   * Sanitize data before using|insertion
   * FIXME fix embeded objects/arrays
   * @inheritdoc https://www.npmjs.com/package/xss
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   */
  public static sanitize = (req: Request, res: Response, next: Function) => {
    try {
      for(let key in req.body)
      {
        //req.body[key] = XSS(req.body[key]);
      }
      next();
    }
    catch(e) { next(Boom.expectationFailed(e.message)); }
  };
};