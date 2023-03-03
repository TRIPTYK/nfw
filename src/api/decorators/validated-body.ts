
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Class } from 'type-fest';
import { validateOrReject } from '../utils/validate-or-reject.js';

export function ValidatedBody<T > (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext<unknown>) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.request.body);
    }, 'validated-body');
}
