/* eslint-disable no-console */
import 'reflect-metadata';
import { expect, test, vi, afterEach, beforeEach, afterAll } from 'vitest';
import type { LoggerService } from '../../../../src/services/logger.service.js';
import { LoggerServiceImpl } from '../../../../src/services/logger.service.js';

let loggerService: LoggerService;

const configurationGetMock = vi.fn();

beforeEach(() => {
  loggerService = new LoggerServiceImpl(
        {
          get: configurationGetMock
        } as never
  );
})

afterEach(() => {
  vi.restoreAllMocks();
})

vi.stubGlobal('console', {
  info: vi.fn(),
  error: vi.fn()
})

test('If logging is enabled, it should output to console.log', () => {
  configurationGetMock.mockReturnValue(true);
  loggerService.info('test');
  loggerService.error('test');

  const [infoFirstParameter] = (console.info as any).mock.calls[0];

  expect(infoFirstParameter).toContain('test');
  //  .error() generates an aditionnal  trace log
  expect(console.info).toBeCalledTimes(3);
})

test('If logging is disabled, it should not output to console.log', () => {
  configurationGetMock.mockReturnValue(false);
  loggerService.info('test');
  loggerService.error('test');
  expect(console.info).not.toBeCalledTimes(2);
})

afterAll(() => {
  vi.unstubAllGlobals();
})
