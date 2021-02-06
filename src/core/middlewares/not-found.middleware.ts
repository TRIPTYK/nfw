/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import * as JSONAPISerializer from "json-api-serializer";
import { singleton } from "tsyringe";
import { BaseMiddleware } from "./base.middleware";

@singleton()
export default class NotFoundMiddleware extends BaseMiddleware {
    private serializer = new JSONAPISerializer();

    public use(
        req: Request,
        res: Response,
        next: (err?: any) => void,
        args: any
    ) {
        res.status(404);
        res.json(
            this.serializer.serializeError({
                detail: "Not found",
                status: "404"
            })
        );
    }
}
