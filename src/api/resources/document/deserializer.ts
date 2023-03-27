import { singleton } from '@triptyk/nfw-core';
import type { ResourceDeserializer } from 'resources';
import type { DocumentResource } from './resource.js';

@singleton()
export class DocumentResourceDeserializer implements ResourceDeserializer<DocumentResource> {
  deserialize (payload: Record<string, unknown>) {
    return payload;
  }
}
