import type { ResourceFactory } from 'resources';
import type { DocumentResource } from './resource.js';

export class DocumentResourceFactory implements ResourceFactory<DocumentResource> {
  create () {
    return {} as never;
  }
}
