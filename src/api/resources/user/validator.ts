
import { AbstractResourceValidator } from 'resources';
import { object, string } from 'yup';
import type { UserResource } from './resource.js';

const userSchema = object({
  name: string().required()
});

export class UserResourceValidator extends AbstractResourceValidator<UserResource> {
  async validate (resource: UserResource) {
    await userSchema.validate(resource);
  }
}
