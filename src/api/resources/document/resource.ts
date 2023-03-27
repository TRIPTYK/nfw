import { singleton } from '@triptyk/nfw-core';
import type { Resource } from 'resources';

@singleton()
export class DocumentResource implements Resource {
  type = 'document';
  id?: string | undefined;
}
