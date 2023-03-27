import { singleton } from '@triptyk/nfw-core';
import type { PartialResource, ResourceValidator, ValidationContext } from 'resources';
import { object } from 'yup';
import type { UserResource } from './resource.js';

const userSchema = object({});

interface UserResourceValidationContext extends ValidationContext<UserResource> {
  update: {},
  create: {},
}

@singleton()
export class UserResourceValidator implements ResourceValidator<UserResource, UserResourceValidationContext> {
  validate (resource: PartialResource<UserResource>, action: string) {
    if (action === 'create') {
      return this.validateCreate(resource);
    }
    if (action === 'update') {
      return this.validateUpdate(resource);
    }
    throw new Error();
  }

  private async validateUpdate (resource: PartialResource<UserResource>) {
    return {
      isValid: true,
      result: await userSchema.validate(resource)
    } as const
  }

  private async validateCreate (resource: PartialResource<UserResource>) {
    return {
      isValid: true,
      result: await userSchema.validate(resource)
    } as const
  }
}
