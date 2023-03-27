import type { ResourceSerializer } from 'resources';
import type { DocumentResource } from './resource.js';

export class DocumentResourceSerializer implements ResourceSerializer<DocumentResource> {
  serializeOne (): unknown {
    throw new Error('Method not implemented.');
  }

  serializeMany (): unknown {
    throw new Error('Method not implemented.');
  }
}
