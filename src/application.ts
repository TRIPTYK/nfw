/* eslint-disable import/first */
import 'reflect-metadata';
import { container, inject, singleton } from '@triptyk/nfw-core';
import { ConfigurationServiceImpl } from './services/configuration.service.js';
import KoaQS from 'koa-qs';
import Koa from 'koa';
import { MainArea } from './areas/main.area.js';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import { requestContext } from '@triptyk/nfw-mikro-orm';
import { createApplication, resolveMiddlewareInstance } from '@triptyk/nfw-http';
import type { Server } from 'http';
import { LoggerServiceImpl } from './services/logger.service.js';
import type { LoggerService } from './services/logger.service.js';
import { DatabaseConnectionImpl } from './database/connection.js';
import { LogMiddleware } from './middlewares/log.middleware.js';
import { DefaultErrorHandler } from './error-handler/default.error-handler.js';
import { createRateLimitMiddleware } from './middlewares/rate-limit.middleware.js';
import { BadRequestError } from './errors/bad-request.js';
import { PayloadTooLargeError } from './errors/payload-too-large.js';
import { setupRegistry } from './features/users/resources/registry.js';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';

@singleton()
export class Application {
  private httpServer?: Server;
  private koaServer?: Koa;

  public constructor (
    @inject(ConfigurationServiceImpl) private configurationService : ConfigurationServiceImpl,
    @inject(DatabaseConnectionImpl) private databaseConnection : DatabaseConnectionImpl,
    @inject(LoggerServiceImpl) private logger: LoggerService
  ) {
    configurationService.load();
  }

  public async setup () {
    await this.databaseConnection.connect();
    const registry = container.resolve(ResourcesRegistryImpl);
    setupRegistry(registry);
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
