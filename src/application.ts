/* eslint-disable import/first */
import 'reflect-metadata';
import { inject, singleton } from '@triptyk/nfw-core';
import { ConfigurationServiceImpl } from './api/services/configuration.service.js';
import KoaQS from 'koa-qs';
import Koa from 'koa';
import { MainArea } from './api/areas/main.area.js';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import { requestContext } from '@triptyk/nfw-mikro-orm';
import { createApplication, resolveMiddlewareInstance } from '@triptyk/nfw-http';
import type { Server } from 'http';
import type { LoggerService } from './api/services/logger.service.js';
import { LoggerServiceImpl } from './api/services/logger.service.js';
import { DatabaseConnectionImpl } from './database/connection.js';
import { DatabaseGenerator } from './database/generator.js';
import { LogMiddleware } from './api/middlewares/log.middleware.js';
import { DefaultErrorHandler } from './api/error-handler/default.error-handler.js';
import { createRateLimitMiddleware } from './api/middlewares/rate-limit.middleware.js';
import { BadRequestError } from './api/errors/web/bad-request.js';
import { PayloadTooLargeError } from './api/errors/web/payload-too-large.js';

@singleton()
export class Application {
  private httpServer?: Server;
  private koaServer?: Koa;

  public constructor (
    @inject(ConfigurationServiceImpl) private configurationService : ConfigurationServiceImpl,
    @inject(DatabaseConnectionImpl) private databaseConnection : DatabaseConnectionImpl,
    @inject(LoggerServiceImpl) private logger: LoggerService,
    @inject(DatabaseGenerator) private databaseGenerator: DatabaseGenerator
  ) {
    configurationService.load();
  }

  public async setup () {
    await this.databaseConnection.connect();

    if (this.configurationService.get('REFRESH_DATABASE')) {
      await this.databaseGenerator.generateDatabase();
    }

    const server = this.setupKoaServer();

    await createApplication({
      server,
      controllers: [MainArea]
    });

    KoaQS(server);
  }

  public listen () {
    return new Promise<void>((resolve) => this.httpServer = this.koaServer?.listen(this.configurationService.get('PORT'), () => {
      this.logger?.info(`Listening on port ${this.configurationService.get('PORT')}`);
      resolve();
    }));
  }

  private setupKoaServer () {
    const server = this.koaServer = new Koa();

    server.use(requestContext);
    server.use(helmet());
    server.use(cors({
      origin: this.configurationService.get('CORS')
    }));
    server.use(resolveMiddlewareInstance(LogMiddleware));
    server.use(resolveMiddlewareInstance(DefaultErrorHandler));
    server.use(resolveMiddlewareInstance(createRateLimitMiddleware(10000, 30, 'Please slow down')));
    server.use(koaBody({
      jsonLimit: '128kb',
      text: false,
      json: true,
      multipart: false,
      urlencoded: false,
      onError: (err: Error) => {
        if (err.name === 'PayloadTooLargeError') {
          throw new PayloadTooLargeError(err.message);
        }
        throw new BadRequestError(err.message);
      }
    }));

    return server;
  }

  public async stop () {
    this.httpServer?.closeAllConnections();
    await this.databaseConnection.close();
    if (this.httpServer) {
      await new Promise((resolve) => this.httpServer!.close(resolve));
    }
  }
}
