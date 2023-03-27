import type { ResourceDeserializer } from 'resources';
import type { UserResource } from './resource.js';

export class UserResourceDeserializer implements ResourceDeserializer<UserResource> {
  deserialize (payload: Record<string, unknown>) {
    return payload;
  }
}
