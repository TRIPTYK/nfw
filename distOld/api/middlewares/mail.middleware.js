"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_sender_service_1 = require("./../services/mail-sender.service");
const Boom = require("boom");
/**
 *
 */
class MailMiddleware {
    constructor() {
        /**
         * Wrap API email sending service.
         *
         * Send an email before/after action, on a route.
         *
         * @param req Request object
         * @param res Response object
         * @param next Function
         */
        this.mail = async (req, res, next) => {
            try {
                let response = await mail_sender_service_1.sendmail(req);
                if (response.status !== 200)
                    next(Boom.expectationFailed(response), false);
                else
                    next(null, response);
            }
            catch (e) {
                Boom.expectationFailed(e.message);
            }
        };
    }
}
exports.MailMiddleware = MailMiddleware;
;
