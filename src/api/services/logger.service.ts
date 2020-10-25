/**
 * This logger implements Winston module for writing custom logs
 *
 * @package https://github.com/winstonjs/winston
 */

import * as Winston from "winston";
import * as Moment from "moment-timezone";
import { Environments } from "../enums/environments.enum";
import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";
import ConfigurationService from "../../core/services/configuration.service";

@singleton()
@autoInjectable()
export class LoggerService extends BaseService {
    private _logger: Winston.Logger;

    public constructor(private configurationService: ConfigurationService) {
        super();
        const {env} = configurationService.config;
        const directory = env === Environments.Test ? "test" : "dist";

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

        this._logger = Winston.createLogger({
            format: timestampFormatJSON,
            level: "info",
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                new Winston.transports.File({filename: `${directory}/logs/error.log`, level: "error"}),
                new Winston.transports.File({filename: `${directory}/logs/combined.log`})
            ]
        });

        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (env !== Environments.Production) {
            this.logger.add(new Winston.transports.Console({format: Winston.format.combine(
                Winston.format.label({ label: env }),
                timestampFormatText
            )}));
        }

        if (!process.env.CLI) {
            this.logger.stream({
                write: (message) => {
                    this.logger.info(message.trim());
                }
            });
        }
    }

    public get logger() {
        return this._logger;
    }

    public init() {
        return true;
    }
}
