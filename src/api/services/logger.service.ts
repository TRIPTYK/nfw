import { inject, injectable, singleton } from '@triptyk/nfw-core';
import Tracer from 'tracer';
import type { Env, ConfigurationService } from './configuration.service.js';
import { ConfigurationServiceImpl } from './configuration.service.js';

export interface LoggerService {
  info(...args: unknown[]): void,
  error(...args: unknown[]): void,
}

@injectable()
@singleton()
export class LoggerServiceImpl implements LoggerService {
  private _logger: Tracer.Tracer.Logger<string>;

  public constructor (
    @inject(ConfigurationServiceImpl) configurationService: ConfigurationService<Env>
  ) {
    this._logger = Tracer.dailyfile({
      root: 'dist',
      maxLogFiles: 10,
      transport: function (data) {
        if (configurationService.get('LOGGING')) {
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

  close () {
    this._logger.close();
  }
}
