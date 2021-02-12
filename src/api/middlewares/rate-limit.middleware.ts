import { BaseMiddleware } from "@triptyk/nfw-core";
import { Request, Response } from "express";
import * as RateLimit from "express-rate-limit";
import { injectable } from "tsyringe";

export type RateLimitMiddlewareArgs = any;

@injectable()
export default class RateLimitMiddleware extends BaseMiddleware {
    private rateInstance: RateLimit.Instance;

    public constructor() {
        super();
        this.rateInstance = new RateLimit({
            max: 50,
            message:
                "Too many requests from this IP, please try again after an hour",
            windowMs: 300000
        });
    }

    public use(req: Request, res: Response, next: (err?: any) => void): any {
        return this.rateInstance(req, res, next);
    }
}
