import { singleton } from '@triptyk/nfw-core';
import type { ResourceSchema } from 'resources';
import type { DocumentResource } from './resource.js';

@singleton()
export class DocumentResourceSchema implements ResourceSchema<DocumentResource> {
  attributes: readonly (keyof DocumentResource)[] = ['name'];
  relationships: Partial<Record<keyof DocumentResource, string>> = {
    writer: 'users'
  };

  type = 'articles';
}
