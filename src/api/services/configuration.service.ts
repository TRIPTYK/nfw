import { injectable, singleton } from '@triptyk/nfw-core';

export interface Configuration {
  jwt: {
    secret: string,
    accessExpires: number,
    refreshExpires: number,
  },
  baseURL: `/${string}`,
  port: number,
  database: {
    host: string,
    user: string,
    password: string,
    database: string,
    port: number,
  },
}

@injectable()
@singleton()
export class ConfigurationService<T = Configuration> {
  private _config!: T;

  public async load () {
    const { default: configuration } = await import(`${process.cwd()}/${process.env.NODE_ENV ?? 'development'}.js`);
    return this._config = Object.seal(configuration);
  }

  public get config (): T {
    if (!this._config) {
      throw new Error('Please use load() before app launch');
    }

    return this._config;
  }

  public getKey<K extends keyof T> (key: K): T[K] {
    return this._config[key];
  }
}
