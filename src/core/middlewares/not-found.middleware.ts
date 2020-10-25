/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Boom from "@hapi/boom";
import * as JSONAPISerializer from "json-api-serializer";
import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../../api/services/logger.service";
import { singleton } from "tsyringe";
import { BaseMiddleware } from "./base.middleware";

@singleton()
export default class NotFoundMiddleware extends BaseMiddleware {
    private serializer = new JSONAPISerializer();


    public use(req: Request, res: Response, next: (err?: any) => void, args: any) {
        res.status(404);
        res.json(this.serializer.serializeError({
            detail: "Not found",
            status: "404"
        }));
    }
}
