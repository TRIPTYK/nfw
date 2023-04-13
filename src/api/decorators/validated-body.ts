import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Schema } from 'yup';

export function ValidatedBody<T> (validationSchema: Schema<T>) {
  return createCustomDecorator(
    (controllerContext: ControllerParamsContext<unknown>) =>
      validationSchema.validate(controllerContext.ctx.request.body, {
        abortEarly: false,
        strict: true
      }),
    'validated-body'
  );
}
