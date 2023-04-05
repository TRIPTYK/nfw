import { singleton } from '@triptyk/nfw-core';
import type { ResourceValidator } from 'resources';
import { object } from 'yup';
import type { DocumentResource } from './resource.js';

const userSchema = object();

@singleton()
export class DocumentResourceValidator implements ResourceValidator<DocumentResource> {
  async validate (resource: DocumentResource) {
    return {
      result: await userSchema.validate(resource),
      isValid: true
    } as const
  }
}
