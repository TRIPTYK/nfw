import type { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { registerUser } from './user/register.js';

export function setupRegistry (registry: ResourcesRegistryImpl) {
  registerUser(registry);
}
