
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Schema } from 'yup';
import { validate } from '../utils/validate-context.js';

export function ValidatedParams<T> (validationSchema : Schema<T>) {
  return createCustomDecorator((controllerContext:ControllerParamsContext<unknown>) => validate(validationSchema, controllerContext.ctx, 'params'), 'validated-body');
}
