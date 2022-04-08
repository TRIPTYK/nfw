import type { Class } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';

export function validateOrReject<T extends SchemaBase> (ValidationClass: Class<T>, content: Record<string, unknown>) {
  const validatedBody = new ValidationClass(content);
  const isChecked = validatedBody.validate();
  if (isChecked !== true) {
    throw isChecked;
  }
  return validatedBody;
}
