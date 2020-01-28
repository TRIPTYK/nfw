import * as Boom from "@hapi/boom";
import * as JSONAPISerializer from "json-api-serializer";
import { LoggerConfiguration } from "../../config/logger.config";

export default class ErrorHandlerMiddleware {
    public static log(err, req, res, next): void {
        const message = `${req.method} ${req.url} : ${err.message}`;
        LoggerConfiguration.logger.error(message);
        next(err);
    }

    public static exit(err: Boom.Boom, req, res, next): void {
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
