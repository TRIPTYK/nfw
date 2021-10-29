import { injectable, singleton } from '@triptyk/nfw-core';

export interface Configuration {
  jwt: {
    secret: string,
    accessExpirationMinutes: number,
    refreshExpirationMinutes: number,
  },
}

@injectable()
@singleton()
export class ConfigurationService<T = Configuration> {
  private _config!: T;

  public get config (): T {
    return this._config;
  }

  public constructor () {
    this.loadConfiguration();
  }

  private async loadConfiguration () {
    this._config = await import(`${process.cwd()}/${process.env.NODE_ENV ?? 'development'}.js`).catch(err => console.log(err));
  }

  public getKey (key: keyof T) {
    return this._config[key];
  }
}
