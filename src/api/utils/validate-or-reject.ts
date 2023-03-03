
import { validate } from 'fastest-validator-decorators';
import type { Class } from 'type-fest';

export async function validateOrReject<T extends object> (ValidationClass: Class<T>, content: Record<string, unknown>) {
  const validatedBody = new ValidationClass();
  Object.assign(validatedBody, content);
  const isChecked = await validate(validatedBody);
  if (isChecked !== true) {
    throw isChecked;
  }
  return validatedBody;
}
