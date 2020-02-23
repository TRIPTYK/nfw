import * as Boom from "@hapi/boom";
import * as JSONAPISerializer from "json-api-serializer";
import { LoggerConfiguration } from "../../config/logger.config";
import { NextFunction , Request , Response } from "express";

export default class ErrorHandlerMiddleware {
    public static log(err: any, req: Request, res: Response, next: NextFunction): void {
        const message = `${req.method} ${req.url} : ${err.message}`;
        LoggerConfiguration.logger.error(message);
        next(err);
    }

    public static exit(error: any, req: Request, res: Response, next: NextFunction): void {
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
            res.json(ErrorHandlerMiddleware.serializer.serializeError(allErrors));
        }

        if (!error.isBoom) {
            error = Boom.expectationFailed(error.message);
        }

        res.status(error.output.statusCode);
        res.json(ErrorHandlerMiddleware.serializer.serializeError({
            detail: error.message,
            status: error.output.statusCode
        }));
    }

    public static notFound(req: Request, res: Response , next: NextFunction): void {
        res.status(404);
        res.json(ErrorHandlerMiddleware.serializer.serializeError({
            detail: "Not found",
            status: "404"
        }));
    }

    private static serializer = new JSONAPISerializer();
}
