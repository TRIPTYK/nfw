import { BaseMiddleware, GlobalMiddleware } from "@triptyk/nfw-core";
import { Request, Response } from "express";
import RateLimit from "express-rate-limit";

export type RateLimitMiddlewareArgs = any;

@GlobalMiddleware({
    priority: 0
})
export class RateLimitMiddleware extends BaseMiddleware {
    private rateInstance: RateLimit.RateLimit;

    public constructor() {
        super();
        this.rateInstance = RateLimit({
            max: 50000,
            message:
                "Too many requests from this IP, please try again after an hour",
            windowMs: 300000
        });
    }

    public use(req: Request, res: Response, next: (err?: any) => void): any {
        return this.rateInstance(req, res, next);
    }
}
