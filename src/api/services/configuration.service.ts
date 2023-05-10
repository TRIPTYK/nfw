import { injectable, singleton } from '@triptyk/nfw-core';
import { load } from 'ts-dotenv';
import type { EnvType } from 'ts-dotenv';
import type { StringKeyOf } from 'type-fest';
import { ConfigurationNotLoadedError } from '../errors/configuration-not-loaded.js';

export interface ConfigurationService<T extends Record<string, unknown>> {
  get<K extends StringKeyOf<T>>(key: K): T[K],
  load(): void,
}

export type Env = EnvType<typeof schema>;

export const schema = {
  NODE_ENV: {
    type: String,
    default: 'development'
  },
  LOGGING: {
    type: Boolean,
    default: true
  },
  PORT: Number,
  DATABASE_TYPE: ['mysql' as const, 'mariadb' as const, 'postgresql' as const],
  REFRESH_TOKEN_EXPIRES: Number,
  JWT_SECRET: String,
  JWT_EXPIRES: Number,
  PRODUCTION_ENV: {
    type: Boolean,
    default: false
  },
  JWT_ISS: String,
  JWT_AUDIENCE: String,
  DATABASE_PORT: Number,
  DATABASE_PASSWORD: String,
  DATABASE_HOST: String,
  DATABASE_NAME: String,
  DATABASE_USER: String,
  DEBUG: Boolean,
  CORS: String
};

@injectable()
@singleton()
export class ConfigurationServiceImpl implements ConfigurationService<Env> {
  private env?: Env;

  get<K extends StringKeyOf<Env>> (key: K): Env[K] {
    if (!this.env) {
      throw new ConfigurationNotLoadedError();
    }
    return this.env[key];
  }

  load (): void {
    this.env = load(schema, `config/env/${process.env.NODE_ENV ?? 'development'}.env`);
  }
}
