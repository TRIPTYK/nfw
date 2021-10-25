import { RouterContext } from "@koa/router";
import { createCustomDecorator } from "@triptyk/nfw-core";

export function CurrentUser(reload: boolean) {
    return createCustomDecorator((ctx: RouterContext,[isCool]: [boolean]) => {
        return ctx.headers["user-agent"] + isCool;
    }, [reload]);
}