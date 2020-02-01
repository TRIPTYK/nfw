import {Request, Response} from "express";
import * as XSS from "xss";
import * as Boom from "@hapi/boom";
import { injectable } from "tsyringe";
import { IMiddleware } from "./base.middleware";

@injectable()
export class SecurityMiddleware implements IMiddleware {
    public use(req: Request, res: Response, next) {
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
