
import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { SchemaBase } from 'fastest-validator-decorators';
import type { Class } from 'type-fest';
import { validateOrReject } from '../utils/validate-or-reject.js';

export function ValidatedBody<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext) => {
      return validateOrReject(ValidationClass, controllerContext.ctx.request.body);
    }, 'validated-body');
}
