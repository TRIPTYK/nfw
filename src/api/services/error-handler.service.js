"use strict";
exports.__esModule = true;
var logger_config_1 = require("./../../config/logger.config");
var Notifier = require("node-notifier");
var Boom = require("boom");
var _getErrorCode = function (error) {
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
var log = function (err, str, req) {
    var message = 'Error in ' + req.method + ' ' + req.url + ' : ' + str + '\n';
    logger_config_1.logger.error(message);
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
var notify = function (err, str, req) {
    var title = 'Error in ' + req.method + ' ' + req.url;
    Notifier.notify({
        title: title,
        message: str
    });
};
exports.notify = notify;
/**
 * Display clean error for final user
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
var exit = function (err, req, res, next) {
    if (!err.httpStatusCode && !err.status && !err.isBoom)
        err = Boom.expectationFailed(err.message);
    res.status(_getErrorCode(err));
    res.json(err);
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
var notFound = function (req, res, next) {
    res.status(404);
    res.json(Boom.notFound('End point not found'));
};
exports.notFound = notFound;
