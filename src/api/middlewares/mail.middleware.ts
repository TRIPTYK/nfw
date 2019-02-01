import { sendmail } from "./../services/mail-sender.service";
import { Request, Response } from "express";

import * as Boom from "boom";

/**
 * 
 */
export class MailMiddleware {

  constructor() {}

  /**
   * Wrap API email sending service.
   * 
   * @description Send an email before/after action, on a route. 
   * 
   * @param req Request
   * @param res Response
   * @param next Function
   */
  public mail = async (req: Request, res: Response, next: Function) => {
    try {
      let response = await sendmail(req);
      if(response.status !== 200) next( Boom.expectationFailed(response), false);
      else next( null, response);
    }
    catch(e) { Boom.expectationFailed(e.message); }
  };

};

