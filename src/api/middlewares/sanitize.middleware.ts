import { Request, Response } from "express";
import * as XSS from "xss";
import * as Boom from "boom";

/**
 * Sanitize data before using|insertion
 * 
 * @inheritdoc https://www.npmjs.com/package/xss
 * 
 * @param req Request
 * @param res Response
 * @param next Function
 */
const sanitize = (req: Request, res: Response, next: Function) => {
  try {
    for(let key in req.body)
    {
      req.body[key] = XSS(req.body[key]);
    }
    next();
  }
  catch(e) { next(Boom.expectationFailed(e.message)); }
};

export { sanitize };