import 'reflect-metadata';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { ConfigurationService } from '../../../../src/services/configuration.service.js';
import { ConfigurationServiceImpl } from '../../../../src/services/configuration.service.js';
import * as exports from 'ts-dotenv';
import { ConfigurationNotLoadedError } from '../../../../src/errors/configuration-not-loaded.js';

let configurationService: ConfigurationService<{}>;

beforeEach(() => {
  configurationService = new ConfigurationServiceImpl();
})

afterEach(() => {
  vi.restoreAllMocks();
})

test('Throws if load fails', () => {
  vi.spyOn(exports, 'load').mockImplementation(() => { throw new Error() });
  expect(() => configurationService.load()).toThrowError();
});

test('Throws if configuration is not loaded when accessing a key', () => {
  expect(() => configurationService.get('key' as never)).toThrowError(ConfigurationNotLoadedError);
});

test('Read a loaded configuration key returns key value', () => {
  vi.spyOn(exports, 'load').mockImplementation(
    () => {
      return {
        key: true
      } as never
    }
  );

  configurationService.load();

  expect(configurationService.get('key' as never)).toBe(true);
});

test('Read an unknown configuration key returns undefined', () => {
  vi.spyOn(exports, 'load').mockImplementation(
    () => ({})
  );

  configurationService.load();

  expect(configurationService.get('key' as never)).toBeUndefined();
});
