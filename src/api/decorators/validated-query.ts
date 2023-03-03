
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { Class } from 'type-fest';
import { validateOrReject } from '../utils/validate-or-reject.js';

export function ValidatedQuery<T extends object> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext: ControllerParamsContext<unknown>) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.query);
    }, 'entity-from-query');
}
