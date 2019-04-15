"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_config_1 = require("./../../config/logger.config");
const Notifier = require("node-notifier");
const Boom = require("boom");
const jsonapi_serializer_1 = require("jsonapi-serializer");
const _getErrorCode = (error) => {
    if (typeof (error.httpStatusCode) !== 'undefined')
        return error.httpStatusCode;
    if (typeof (error.status) !== 'undefined')
        return error.status;
    if (error.isBoom)
        return error.output.statusCode;
    return 500;
};
/**
 * Write errors in a log file
 *
 * @param {*} err
 * @param {*} str
 * @param {*} req
 */
const log = (req, res, next) => {
    let message = 'Error in ' + req.method + ' ' + req.url + '\n';
    logger_config_1.logger.error(message);
    next();
};
exports.log = log;
/**
 * Display error in desktop notification
 *
 * @param {*} err
 * @param {*} str
 * @param {*} req
 *
 * @requires libnotify-bin
 */
const notify = (err, str, req) => {
    let title = 'Error in ' + req.method + ' ' + req.url;
    Notifier.notify({
        title: title,
        message: str
    });
};
exports.notify = notify;
const _boomToJSONAPI = (err) => {
    return new jsonapi_serializer_1.Error({
        status: _getErrorCode(err).toString(),
        title: err.output ? err.output.payload.error : "Error",
        meta: { validation: err.errors ? err.errors : undefined },
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
    if (!err.httpStatusCode && !err.status && !err.isBoom)
        err = Boom.expectationFailed(err.message);
    res.status(_getErrorCode(err));
    res.json(_boomToJSONAPI(err));
};
exports.exit = exit;
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
exports.notFound = notFound;