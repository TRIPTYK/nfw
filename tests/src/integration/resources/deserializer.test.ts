import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { beforeEach, expect, test } from 'vitest';
import { setupRegistry } from '../../../../src/api/resources/registry.js';
import { UsersDeserializer } from '../../../../src/api/resources/user/deserializer.js';

let registry : ResourcesRegistry;

beforeEach(async () => {
  registry = container.resolve(ResourcesRegistryImpl);
  setupRegistry(registry as ResourcesRegistryImpl);
})

test('Deserializer deserializes from schema', async () => {
  const deserializer = new UsersDeserializer('users', registry);
  const deserialized = await deserializer.deserialize({
    unknown: 'unknown',
    name: 'name'
  });

  expect(deserialized).toStrictEqual({

  });
})
