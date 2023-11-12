import type { MikroORM } from '@mikro-orm/core';
import { LoadStrategy } from '@mikro-orm/core';
import { inject, singleton } from '@triptyk/nfw-core';
import { init } from '@triptyk/nfw-mikro-orm';
import type { Promisable } from 'type-fest';
import { NotFoundError } from '../errors/not-found.js';
import type { ConfigurationService, Env } from '../services/configuration.service.js';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';
import { getConfiguration } from './configuration.js';

export interface DatabaseConnection<T> {
  connect(): Promisable<T>,
  close(): Promisable<void>,
  connection: T,
}

@singleton()
export class DatabaseConnectionImpl implements DatabaseConnection<MikroORM> {
  private _orm?: MikroORM;

  public constructor (
    @inject(ConfigurationServiceImpl) private configurationService: ConfigurationService<Env>
  ) {}

  public get connection () {
    if (!this._orm) {
      throw new Error('Database connection not established');
    }
    return this._orm;
  }

  public async connect () {
    this._orm = await init({
      ...getConfiguration(this.configurationService),
      // api-specific behaviors
      loadStrategy: LoadStrategy.SELECT_IN,
      findOneOrFailHandler: () => {
        return new NotFoundError();
      }
    });

    const isConnected = await this._orm.isConnected();

    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    return this._orm;
  }

  public close () {
    return this._orm?.close();
  }
}
