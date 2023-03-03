import { inject, injectable, singleton } from '@triptyk/nfw-core';
import Tracer from 'tracer';
import { ConfigurationService } from './configuration.service.js';

export interface LoggerService {
  info(...args: unknown[]): void,
  error(...args: unknown[]): void,
}

@injectable()
@singleton()
export class LoggerServiceImpl implements LoggerService {
  private _logger: Tracer.Tracer.Logger<string>;

  public constructor (@inject(ConfigurationService) configurationService: ConfigurationService) {
    const logConfig = configurationService.getKey('logger');

    this._logger = Tracer.dailyfile({
      root: logConfig.dir,
      maxLogFiles: 10,
      transport: function (data) {
        if (logConfig.logToConsole) {
          // eslint-disable-next-line no-console
          console.info(data.output);
        }
      }
    });
  }

  info (...args: unknown[]): void {
    this._logger.log(...args);
  }

  error (...args: unknown[]): void {
    this._logger.trace(...args);
    this._logger.error(...args);
  }
}
