import * as Boom from "@hapi/boom";
import { BaseMiddleware } from "@triptyk/nfw-core";
import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import * as XSS from "xss";

export type SecurityMiddlewareArgs = any;

@injectable()
export class SecurityMiddleware extends BaseMiddleware {
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
