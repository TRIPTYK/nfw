"use strict";
/**
 * This logger implements Winston module for writing custom logs
 *
 * @package https://github.com/winstonjs/winston
 */
exports.__esModule = true;
var Winston = require("winston");
var env = process.argv[2] && process.argv[2] === '--env' ? process.argv[3] : 'development';
var directory = env === 'test' ? 'test' : 'dist';
var logger = Winston.createLogger({
    level: 'info',
    format: Winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new Winston.transports.File({ filename: process.cwd() + "/" + directory + "/logs/error.log", level: 'error' }),
        new Winston.transports.File({ filename: process.cwd() + "/" + directory + "/logs/combined.log" }),
    ]
});
exports.logger = logger;
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new Winston.transports.Console({ format: Winston.format.simple() }));
}
logger.stream({ write: function (message) { logger.info(message.trim()); } });
