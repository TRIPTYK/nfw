import { inject, injectable, singleton } from '@triptyk/nfw-core';
import Tracer from 'tracer';
import { ConfigurationService } from './configuration.service.js';

@injectable()
@singleton()
export class LoggerService {
  private _logger: Tracer.Tracer.Logger;

  // eslint-disable-next-line no-useless-constructor
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
      },
    });
  }

  public get logger () {
    return this._logger;
  }
}
