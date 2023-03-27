import type { ResourceValidator, ValidationContext } from 'resources';
import { object } from 'yup';
import type { DocumentResource } from './resource.js';

const userSchema = object();

interface Context extends ValidationContext<DocumentResource> {

}

export class DocumentResourceValidator implements ResourceValidator<DocumentResource, Context> {
  async validate (resource: DocumentResource) {
    return {
      result: await userSchema.validate(resource),
      isValid: true
    } as const
  }
}
