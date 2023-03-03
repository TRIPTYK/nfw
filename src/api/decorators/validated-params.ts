
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { validateOrReject } from '../utils/validate-or-reject.js';
import type { Class } from 'type-fest';

export function ValidatedParams<T extends object> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext<unknown>) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.params);
    }, 'entity-from-params');
}
