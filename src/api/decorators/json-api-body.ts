import { container } from '@triptyk/nfw-core';
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { ResourcesRegistry } from '@triptyk/nfw-resources';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import type { Schema } from 'yup';
import { validatedBody } from './validated-body.js';

export interface Controller {
  registry: ResourcesRegistry,
}

function jsonApiBody<T> (resourceName: string, validationSchema: Schema<T, any, any, ''>) {
  return async (controllerContext: ControllerParamsContext<unknown>) => {
    const body = await container.resolve(ResourcesRegistryImpl).getDeserializerFor(resourceName).deserialize(controllerContext.ctx.request.body);
    return validatedBody(body, validationSchema);
  };
}

export function JsonApiBody<T> (resourceName: string, validationSchema: Schema<T>) {
  return createCustomDecorator(jsonApiBody<T>(resourceName, validationSchema), 'json-api-body');
}
