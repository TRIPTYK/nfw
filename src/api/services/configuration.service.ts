import { injectable, singleton } from '@triptyk/nfw-core';

export interface Configuration {
  jwt: {
    secret: string,
    accessExpires: number,
    refreshExpires: number,
  };
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

  private async loadConfiguration() {
    const { Configuration } = await import(`${process.cwd()}/${process.env.NODE_ENV ?? 'development'}.js`);
    this._config = Configuration;
  }

  public getKey (key: keyof T) {
    return this._config[key];
  }
}
