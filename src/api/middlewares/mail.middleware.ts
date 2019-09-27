import {sendmail} from "./../services/mail-sender.service";
import {Request, Response} from "express";

import Boom from "@hapi/boom";

/**
 *
 */
export class MailMiddleware {

    constructor() {
    }

    /**
     * Wrap API email sending service.
     *
     * Send an email before/after action, on a route.
     *
     * @param req Request object
     * @param res Response object
     * @param next Function
     */
    public mail = async (req: Request, res: Response, next: Function) => {
        try {
            let response : any = await sendmail(req);
            if (response.status !== 200) next(Boom.expectationFailed(response), false);
            else next(null, response);
        } catch (e) {
            Boom.expectationFailed(e.message);
        }
    };

}
