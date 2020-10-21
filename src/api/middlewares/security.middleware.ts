import {Request, Response, NextFunction} from "express";
import * as XSS from "xss";
import * as Boom from "@hapi/boom";
import { injectable } from "tsyringe";
import { BaseMiddleware } from "../../core/middlewares/base.middleware";

export type SecurityMiddlewareArgs = any;

@injectable()
export default class SecurityMiddleware extends BaseMiddleware {
    public use(req: Request, res: Response, next: NextFunction) {
        try {
            this.filterXSS(req.body);
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
    private filterXSS(content: any): void {
        for (const key in content) {
            if (typeof content[key] === "object") {
                this.filterXSS(content[key]);
            } else if (typeof content[key] === "string") {
                content[key] = XSS.filterXSS(content[key]);
            }
        }
    }
}
