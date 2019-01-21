import * as Logger from "./../../config/logger.config";
import * as Notifier from "node-notifier";

/**
 * Write errors in a log file
 * 
 * @param {*} err 
 * @param {*} str 
 * @param {*} req 
 */
exports.log = (err, str, req) => {
  let message = 'Error in ' + req.method + ' ' + req.url + ' : ' + str + '\n';
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
exports.notify = (err, str, req) => {
  let title = 'Error in ' + req.method + ' ' + req.url;
  Notifier.notify({
    title : title,
    message : str
  });
};