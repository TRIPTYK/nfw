/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import * as JSONAPISerializer from "json-api-serializer";
import { singleton } from "tsyringe";
import { toCamelCase } from "../utils/case.util";
import { BaseErrorMiddleware } from "./base.error-middleware";

interface JsonApiErrorObject {
    detail: string;
    title: string;
    source: {
        parameter?: string;
        pointer?: string;
    };
    meta: any;
    status: string;
}

@singleton()
export default class ErrorMiddleware extends BaseErrorMiddleware {
    private serializer = new JSONAPISerializer();

    public use(
        error: any,
        req: Request,
        res: Response,
        next: NextFunction,
        args: any
    ) {
        if (Array.isArray(error)) {
            const errs = error;
            const allErrors = [];

            for (const err of errs) {
                for (const suberror of err) {
                    const err: JsonApiErrorObject = {
                        detail: `${suberror.msg} for ${suberror.param} in ${suberror.location}, value is ${suberror.value}`,
                        title: "Validation Error",
                        source: {},
                        meta: {
                            param: toCamelCase(suberror.param),
                            msg: suberror.msg,
                            location: suberror.location
                        },
                        status: "400"
                    };

                    if (["query", "params"].includes(suberror.location)) {
                        err.source.parameter = toCamelCase(suberror.param);
                    }

                    if (suberror.location === "body") {
                        err.source.pointer = `/data/attributes/${toCamelCase(
                            suberror.param
                        )}`;
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
        res.json(
            this.serializer.serializeError({
                detail: error.message,
                status: error.output.statusCode
            })
        );
    }
}
