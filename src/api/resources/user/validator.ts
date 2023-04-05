import { singleton } from '@triptyk/nfw-core';
import type { PartialResource, ResourceValidator } from 'resources';
import { ValidationError, array, object, string } from 'yup';
import type { UserResource } from './resource.js';
import { Roles } from '../../enums/roles.enum.js';

const userSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  password: string().required(),
  email: string().required(),
  role: string().oneOf(Object.values(Roles)).required(),
  documents: array().default([]).required()
});

@singleton()
export class UserResourceValidator implements ResourceValidator<UserResource> {
  async validate (resource: PartialResource<UserResource>) {
    try {
      const validated = await userSchema.validate(resource, {
        abortEarly: false
      });

      return {
        isValid: true as const,
        result: validated
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        return {
          isValid: false as const,
          errors: e.inner.map((e) => ({
            key: e.path ?? 'unknown',
            message: e.message,
            value: e.value
          }))
        }
      }
      throw e;
    }
  }
}
