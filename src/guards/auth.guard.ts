import { ControllerRouteContext, GuardInterface } from "@triptyk/nfw-core";

export class AuthGuard implements GuardInterface {
    can(context: ControllerRouteContext) {
        return false;
    }
}