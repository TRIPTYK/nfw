import { container } from '@triptyk/nfw-core';
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { File } from 'formidable';
import type { Schema } from 'yup';
import { validatedBody } from './validated-body.js';

export interface Controller {
  registry: ResourcesRegistry,
}

function validatedFileBody<T> (resourceName: string, validationSchema: Schema<T, any, any, ''>) {
  return async (controllerContext: ControllerParamsContext<unknown>) => {
    const file = controllerContext.ctx.request.files!.file as File;

    const parsedBody = {
      data: JSON.parse(controllerContext.ctx.request.body.data)
    }
    const parsedRelationships = await container.resolve(ResourcesRegistryImpl).getDeserializerFor(resourceName).deserialize(parsedBody);

    let body: Record<string, unknown> = {
      filename: file.newFilename,
      originalName: file.originalFilename,
      path: file.filepath,
      size: file.size,
      mimetype: file.mimetype,
      ...parsedRelationships,
    }

    if (controllerContext.ctx.request.body.id) {
      body = {
        ...body,
        id: controllerContext.ctx.request.body.id,
      }
    }

    return validatedBody(body, validationSchema);
  };
}

export function ValidatedFileBody<T> (resourceName: string, validationSchema: Schema<T>) {
  return createCustomDecorator(validatedFileBody<T>(resourceName, validationSchema), 'validated-file-body');
}
