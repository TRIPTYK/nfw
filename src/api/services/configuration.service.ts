import { injectable, singleton } from '@triptyk/nfw-core';

export interface Configuration {
  jwt: {
    secret: string,
    accessExpires: number,
    refreshExpires: number,
  },
}

@injectable()
@singleton()
export class ConfigurationService<T = Configuration> {
  private _config!: T;

  public async getConfig (): Promise<T> {
    if (!this._config) {
      const { Configuration } = await import(`${process.cwd()}/${process.env.NODE_ENV ?? 'development'}.js`);
      this._config = Configuration;
    }

    return this._config;
  }

  public getKey (key: keyof T) {
    return this._config[key];
  }
}
