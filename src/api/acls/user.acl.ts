import { AccessControl } from "role-acl";
import { Request } from "express";
import { User } from "../models/user.model";

const acl = new AccessControl();

acl.grant("user")
    .execute("get").on("*")
    .execute("list").on("*")
    .grant("admin")
    .execute("remove").on("users").condition((context: Request) => context.params.id !== (context["user"] as any).id);

export {acl as UserACL};
