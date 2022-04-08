import type { Class, ControllerParamsContext } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';
import { validateOrReject } from '../utils/validate-or-reject.js';

export function ValidatedParams<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.params);
    }, 'entity-from-params', true, [ValidationClass]);
}
