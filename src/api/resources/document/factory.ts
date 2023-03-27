import { singleton } from '@triptyk/nfw-core';
import type { ResourceFactory } from 'resources';
import type { DocumentResource } from './resource.js';

@singleton()
export class DocumentResourceFactory implements ResourceFactory<DocumentResource> {
  create () {
    return {} as never;
  }
}
