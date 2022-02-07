import type { Class } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';
import type formidable from 'formidable';
import { unlink } from 'fs/promises';
import createHttpError from 'http-errors';

export function ValidatedFile (name: string, ValidationClass: Class<SchemaBase>) {
  return createCustomDecorator(async ({ ctx }) => {
    const file = ctx.request.files?.[name] as formidable.File;
    const validatedBody = new ValidationClass({
      filename: file.path.split('/').pop(),
      mimetype: file.type,
      path: file.path,
      size: file.size,
      originalName: file.name,
    });
    const isChecked = validatedBody.validate();
    if (isChecked !== true) {
      // File is invalid, delete it
      await unlink(file.path);
      throw createHttpError(422);
    }
    return validatedBody;
  }, 'file', false, [name, ValidationClass]);
}
