
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { SchemaBase } from 'fastest-validator-decorators';
import { validateOrReject } from '../utils/validate-or-reject.js';
import type { Class } from 'type-fest';

export function ValidatedParams<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.params);
    }, 'entity-from-params');
}
