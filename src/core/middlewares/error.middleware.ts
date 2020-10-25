/* eslint-disable @typescript-eslint/no-unused-vars */
import * as JSONAPISerializer from "json-api-serializer";
import { singleton } from "tsyringe";
import { BaseErrorMiddleware } from "./base.error-middleware";
import {Request, Response, NextFunction} from "express";
import * as Boom from "@hapi/boom";

interface JsonApiErrorObject {
    detail: string;
    title: string;
    source: {
        parameter?: string,
        pointer?: string
    };
    status : string
}

@singleton()
export default class ErrorMiddleware extends BaseErrorMiddleware {
    private serializer = new JSONAPISerializer();

    public use(error: any, req: Request, res: Response, next: NextFunction, args: any) {
        if (Array.isArray(error)) {
            const errs = error;
            const allErrors = [];

            for (const err of errs) {
                for (const suberror of err) {
                    const err : JsonApiErrorObject= {
                        detail: `${suberror.msg} for ${suberror.param} in ${suberror.location}, value is ${suberror.value}`,
                        title: "Validation Error",
                        source: {},
                        status : "400"
                    };

                    if (["query", "params"].includes(suberror.location)) {
                        err.source.parameter = suberror.param;
                    }

                    if (suberror.location === "body") {
                        err.source.pointer = `/data/attributes/${suberror.param}`;
                    }

                    allErrors.push(err);
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
