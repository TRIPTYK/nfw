import { singleton } from '@triptyk/nfw-core';
import type { ResourceSchema } from 'resources';
import { DocumentResource } from './resource.js';

@singleton()
export class DocumentResourceSchema implements ResourceSchema<DocumentResource> {
  type = 'document';
  class = DocumentResource;
  attributes = {

  };

  relationships: Partial<Record<keyof DocumentResource, string>> = {}
}
