import { expect, test, vi } from 'vitest';
import { unixTimestamp } from '../../../../src/utils/date.js';

test('it returns current date in unix timestamp in milliseconds', () => {
  vi.useFakeTimers();
  vi.setSystemTime(6000);
  expect(unixTimestamp()).toStrictEqual(6);
  vi.useRealTimers();
})
