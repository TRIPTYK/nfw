import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Schema } from 'yup';

export function ValidatedParams<T> (validationSchema : Schema<T>) {
  return createCustomDecorator((controllerContext: ControllerParamsContext<unknown>) =>
    validationSchema.validate(controllerContext.ctx.params, {
      abortEarly: false,
      strict: true
    }), 'validated-params');
}
