"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = require("./../../config/logger.config");
var Notifier = require("node-notifier");
/**
 * Write errors in a log file
 *
 * @param {*} err
 * @param {*} str
 * @param {*} req
 */
exports.log = function (err, str, req) {
    var message = 'Error in ' + req.method + ' ' + req.url + ' : ' + str + '\n';
    Logger.error(message);
};
/**
 * Display error in desktop notification
 *
 * @param {*} err
 * @param {*} str
 * @param {*} req
 *
 * @requires libnotify-bin
 */
exports.notify = function (err, str, req) {
    var title = 'Error in ' + req.method + ' ' + req.url;
    Notifier.notify({
        title: title,
        message: str
    });
};
//# sourceMappingURL=error-handler.js.map