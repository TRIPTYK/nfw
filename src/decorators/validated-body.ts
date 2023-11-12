import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Schema } from 'yup';

export function validatedBody<T> (body: unknown, validationSchema: Schema<T>) {
  return validationSchema.validate(body, {
    abortEarly: false,
    strict: true
  })
}

export function ValidatedBody<T> (validationSchema: Schema<T>) {
  return createCustomDecorator(
    (controllerContext: ControllerParamsContext<unknown>) => validatedBody(controllerContext.ctx.request.body, validationSchema)
    ,
    'validated-body'
  );
}
