import { AccessControl } from "role-acl";

const acl = new AccessControl();

acl.grant("user")
    .execute("create").on("video")
    .grant("admin")                   // switch to another role without breaking the chain
    .extend("user")                 // inherit role capabilities. also takes an array
    .execute("*").on("*");

export {acl as UserACL};
