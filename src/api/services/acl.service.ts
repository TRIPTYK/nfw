import { BaseService, Service } from "@triptyk/nfw-core";
import { Permission } from "role-acl";
import { autoInjectable, singleton } from "tsyringe";
import { UserACL } from "../acls/user.acl";
import { User } from "../models/user.model";

/**
 * Elastic search
 */
@Service()
@autoInjectable()
export class ACLService extends BaseService {
    public can(
        user: User,
        method: string,
        context: any,
        resource: string
    ): Promise<Permission> {
        return UserACL.can(user.role)
            .context(context)
            .execute(method)
            .on(resource) as Promise<Permission>;
    }
}
