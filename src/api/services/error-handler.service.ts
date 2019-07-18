import {logger as Logger} from "./../../config/logger.config";
import * as Notifier from "node-notifier";
import * as Boom from "boom";
import * as JSONAPISerializer from "json-api-serializer";

const serializer = new JSONAPISerializer();

const _getErrorCode = (error): number => {

    if (typeof (error.httpStatusCode) !== 'undefined') return error.httpStatusCode;
    if (typeof (error.status) !== 'undefined') return error.status;
    if (error.isBoom) return error.output.statusCode;

    return 500;
};

/**
 * Write errors in a log file
 *
 * @param err
 * @param {*} req
 * @param res
 * @param next
 */
const log = (err, req, res, next)  => {
    let message = `${req.method} ${req.url} : ${err.message}`;
    Logger.error(message);
    next(err);
};

/**
 * Display error in desktop notification
 *
 * @param {*} err
 * @param {*} str
 * @param {*} req
 *
 */
const notify = (err, str, req) => {
    let title = 'Error in ' + req.method + ' ' + req.url;
    Notifier.notify({
        title: title,
        message: str
    });
};

const _boomToJSONAPI = (err: Boom) => {
    return serializer.serializeError({
        status: _getErrorCode(err).toString(),
        title: err.output ? err.output.payload.error : "Error",
        meta: {validation: err.errors ? err.errors : undefined},
        detail: err.message
    });
};

/**
 * Display clean error for final user
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const exit = (err, req, res, next) => {
    if (!err.httpStatusCode && !err.status && !err.isBoom) err = Boom.expectationFailed(err.message);
    res.status(_getErrorCode(err));
    res.json(_boomToJSONAPI(err));
};

/**
 * Display clean error for final user when whe are on the last stack step
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const notFound = (req, res, next) => {
    res.status(404);
    res.json(_boomToJSONAPI(Boom.notFound('End point not found')));
};

export {log, notify, exit, notFound};