import { AccessControl } from "role-acl";
import { Request } from "express";

const acl = new AccessControl();

acl.grant("user")
    .execute("get").on("*")
    .execute("list").on("*")
    .grant("admin")
    .extend("user")
    .execute("remove").on("users").condition((context: Request) => context.params.id !== (context.user as any).id);

export {acl as UserACL};
