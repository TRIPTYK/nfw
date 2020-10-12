/* eslint-disable @typescript-eslint/no-unused-vars */
import * as JSONAPISerializer from "json-api-serializer";
import { singleton } from "tsyringe";
import { BaseErrorMiddleware } from "./base.error-middleware";
import {Request,Response,NextFunction} from "express";
import * as Boom from "@hapi/boom";

@singleton()
export default class ErrorMiddleware extends BaseErrorMiddleware {
    private serializer = new JSONAPISerializer();

    public use(error: any,req: Request, res: Response, next: NextFunction, args: any) {
        if (Array.isArray(error)) {
            const errs = error;
            const allErrors = [];

            for (const err of errs) {
                for (const suberror of err) {
                    allErrors.push({
                        detail: `${suberror.msg} for ${suberror.param} in ${suberror.location}, value is ${suberror.value}`,
                        source: { pointer: `/data/attributes/${suberror.param}` },
                        title: "Validation Error"
                    });
                }
            }

            res.status(400);
            res.json(this.serializer.serializeError(allErrors));
            return;
        }

        if (!error.isBoom) {
            error = Boom.internal(error.message);
        }

        res.status(error.output.statusCode);
        res.json(this.serializer.serializeError({
            detail: error.message,
            status: error.output.statusCode
        }));
    }
}
