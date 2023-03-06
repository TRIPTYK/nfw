
import { AbstractResourceValidator } from 'resources';
import { object, string } from 'yup';
import type { DocumentResource } from './resource.js';

const userSchema = object({
  name: string().required()
});

export class DocumentResourceValidator extends AbstractResourceValidator<DocumentResource> {
  async validate (resource: DocumentResource) {
    await userSchema.validate(resource);
  }
}
