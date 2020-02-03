import * as Boom from "@hapi/boom";
import * as JSONAPISerializer from "json-api-serializer";
import { LoggerConfiguration } from "../../config/logger.config";
import { ValidationError } from "express-validator";

export default class ErrorHandlerMiddleware {
    public static log(err, req, res, next): void {
        const message = `${req.method} ${req.url} : ${err.message}`;
        LoggerConfiguration.logger.error(message);
        next(err);
    }

    public static exit(err: any, req, res, next): void {
        if (Array.isArray(err)) {
            const errs = err;
            const allErrors = [];

            for (const err of errs) {
                for (const suberror of err) {
                    allErrors.push({
                        title: "Validation Error",
                        source: { pointer: `/data/attributes/${suberror.param}` },
                        detail: `${suberror.msg} for ${suberror.param} in ${suberror.location}, value is ${suberror.value}`
                    });
                }
            }

            res.status(400);
            return res.json(ErrorHandlerMiddleware.serializer.serializeError(allErrors));
        }

        if (!err.isBoom) {
            err = Boom.expectationFailed(err.message);
        }

        res.status(err.output.statusCode);
        res.json(ErrorHandlerMiddleware.serializer.serializeError({
            detail: err.message,
            status: err.output.statusCode
        }));
    }

    public static notFound(req, res , next): void {
        res.status(404);
        res.json(ErrorHandlerMiddleware.serializer.serializeError({
            detail: "Not found",
            status: "404"
        }));
    }

    private static serializer = new JSONAPISerializer();
}
