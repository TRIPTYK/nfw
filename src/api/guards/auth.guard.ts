import { ControllerGuardContext, GuardInterface } from '@triptyk/nfw-core'

export class AuthGuard implements GuardInterface {
  can (context: ControllerGuardContext) {
    return context.args![0] as boolean
  }
}
