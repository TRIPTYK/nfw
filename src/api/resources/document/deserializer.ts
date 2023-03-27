import type { ResourceDeserializer } from 'resources';
import type { DocumentResource } from './resource.js';

export class DocumentResourceDeserializer implements ResourceDeserializer<DocumentResource> {
  deserialize (payload: Record<string, unknown>) {
    return payload;
  }
}
