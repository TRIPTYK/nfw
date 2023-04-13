import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Schema } from 'yup';

export function ValidatedQuery<T> (validationSchema : Schema<T>) {
  return createCustomDecorator((controllerContext: ControllerParamsContext<unknown>) =>
    validationSchema.validate(controllerContext.ctx.request.query, {
      abortEarly: false,
      strict: true
    }), 'validated-query');
}
