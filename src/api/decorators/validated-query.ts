import type { Class, ControllerParamsContext } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-core';
import type { SchemaBase } from 'fastest-validator-decorators';
import { validateOrReject } from '../utils/validate-or-reject.js';

export function ValidatedQuery<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.query);
    }, 'entity-from-query', true, [ValidationClass]);
}
