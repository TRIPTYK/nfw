import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { registerDocument } from './documents/register.js';
import { registerUser } from './user/register.js';

export function setupRegistry (registry: ResourcesRegistryImpl) {
  registry.setConfig({
    host: '/api/v1'
  });
  registerUser(registry);
  registerDocument(registry);
}
