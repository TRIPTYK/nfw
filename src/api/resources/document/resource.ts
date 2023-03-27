import type { Resource } from 'resources';

export class DocumentResource implements Resource {
  type = 'document';
  id?: string | undefined;
}
