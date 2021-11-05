import { Class, ControllerParamsContext, createCustomDecorator } from '@triptyk/nfw-core'
import { SchemaBase } from 'fastest-validator-decorators'
import createHttpErrors from 'http-errors';
export function ValidatedBody<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext) => {
      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      if (isChecked !== true) {
        const messages = isChecked.map(error => error.message);
        throw createHttpErrors(400, JSON.stringify(messages));
      }
      return validatedBody;
    },
  )
}
