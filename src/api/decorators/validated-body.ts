import { Class, ControllerParamsContext, createCustomDecorator } from '@triptyk/nfw-core';
import { SchemaBase } from 'fastest-validator-decorators';

export function ValidatedBody<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    async (controllerContext:ControllerParamsContext) => {
      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      if (isChecked !== true) {
        throw isChecked;
      }
      return validatedBody;
    }, 'entity-from-body');
}
