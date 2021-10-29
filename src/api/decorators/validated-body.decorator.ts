import { Class, ControllerParamsContext, createCustomDecorator } from "@triptyk/nfw-core"
import { SchemaBase } from "fastest-validator-decorators"
export function ValidatedBody<T extends SchemaBase> (validationClass : Class<T>) {
    return createCustomDecorator(
        (ctx:ControllerParamsContext)=>{
            console.log(ctx);
            return true;
        },
    )
  }