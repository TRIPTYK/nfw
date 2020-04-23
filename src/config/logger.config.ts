/**
 * This logger implements Winston module for writing custom logs
 *
 * @package https://github.com/winstonjs/winston
 */

import * as Winston from "winston";
import EnvironmentConfiguration from "./environment.config";
import { Environments } from "../api/enums/environments.enum";
import * as Moment from "moment-timezone";

export class LoggerConfiguration {
    public static logger: Winston.Logger;

    public static setup(): void {
        const {env} = EnvironmentConfiguration.config;
        const directory = env === Environments.Test ? "test" : "dist";

        const timestampFnc = () => Moment().format("YYYY-MM-DD HH:mm:ss.SSS");

        const timestampFormatJSON = Winston.format.printf(({ level, message, label }) =>
            JSON.stringify({
                label,
                level,
                message,
                timestamp : timestampFnc()
            })
        );

        const timestampFormatText = Winston.format.printf(({ level, message, label }) =>
            `${timestampFnc()} [${label}] ${level}: ${message}`
        );

        LoggerConfiguration.logger = Winston.createLogger({
            format: timestampFormatJSON,
            level: "info",
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                new Winston.transports.File({filename: `${directory}/logs/error.log`, level: "error"}),
                new Winston.transports.File({filename: `${directory}/logs/combined.log`}),
            ],
        });

        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (env !== Environments.Production) {
            LoggerConfiguration.logger.add(new Winston.transports.Console({format: Winston.format.combine(
                Winston.format.label({ label: env }),
                timestampFormatText
            )}));
        }

        LoggerConfiguration.logger.stream({
            write: (message) => {
                LoggerConfiguration.logger.info(message.trim());
            }
        });
    }
}
