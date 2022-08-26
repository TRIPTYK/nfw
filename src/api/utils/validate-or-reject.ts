
import type { SchemaBase } from 'fastest-validator-decorators';
import type { Class } from 'type-fest';

export function validateOrReject<T extends SchemaBase> (ValidationClass: Class<T>, content: Record<string, unknown>) {
  const validatedBody = new ValidationClass(content);
  const isChecked = validatedBody.validate();
  if (isChecked !== true) {
    throw isChecked;
  }
  return validatedBody;
}
