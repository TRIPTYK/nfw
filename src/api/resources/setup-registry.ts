import type { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import { registerDocumentResource } from './document/registration.js';
import { registerUserResource } from './user/registration.js';

export function setupRegistry (registry: JsonApiRegistryImpl) {
  registerUserResource(registry);
  registerDocumentResource(registry);
}
