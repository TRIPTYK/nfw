import * as Boom from "@hapi/boom";
import * as JSONAPISerializer from "json-api-serializer";
import { LoggerConfiguration } from "../../config/logger.config";
import { fullLog } from "@triptyk/nfw-core";

export default class ErrorHandlerMiddleware {
    private serializer = new JSONAPISerializer();

    public log(err, req, res, next): void {
        const message = `${req.method} ${req.url} : ${err.message}`;
        LoggerConfiguration.logger.error(message);
        next(err);
    }

    public exit(err: Boom.Boom, req, res, next): void {
        if (!err.isBoom) {
            err = Boom.expectationFailed(err.message);
        }

        res.status(err.output.statusCode);
        res.json(this.serializer.serializeError({
            detail: err.message,
            status: err.output.statusCode
        }));
    }

    public notFound(req, res , next): void {
        res.status(404);
        res.json(this.serializer.serializeError({
            detail: "Not found",
            status: "404"
        }));
    }
}
