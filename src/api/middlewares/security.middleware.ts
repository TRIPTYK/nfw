import {Request, Response} from "express";
import * as XSS from "xss";
import * as Boom from "@hapi/boom";

export class SecurityMiddleware {
    /**
     * Sanitize data before using|insertion
     * @inheritdoc https://www.npmjs.com/package/xss
     *
     * @param req Request object
     * @param res Response object
     * @param next Function
     */
    public static sanitize = (req: Request, res: Response, next) => {
        try {
            SecurityMiddleware.filterXSS(req.body);
            next();
        } catch (e) {
            next(Boom.expectationFailed(e.message));
        }
    }

    /**
     * @private static - XSS filter nested properties in request
     *
     * @param content
     */
    private static filterXSS(content: any): void {
        for (const key in content) {
            if (typeof content[key] === "object") {
                SecurityMiddleware.filterXSS(content[key]);
            } else if (typeof content[key] === "string") {
                content[key] = XSS.filterXSS(content[key]);
            }
        }
    }
}
