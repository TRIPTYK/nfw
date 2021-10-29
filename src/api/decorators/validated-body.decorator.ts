import { Class, ControllerParamsContext, createCustomDecorator } from '@triptyk/nfw-core'
import { SchemaBase } from 'fastest-validator-decorators'
export function ValidatedBody<T extends SchemaBase> (ValidationClass : Class<T>) {
  return createCustomDecorator(
    (controllerContext:ControllerParamsContext) => {
      const validatedBody = new ValidationClass(controllerContext.ctx.request.body);
      const isChecked = validatedBody.validate();
      if (isChecked !== true) {
        // todo send correct messages
        throw new Error('testtetdts')
      }
      return validatedBody;
    },
  )
}
