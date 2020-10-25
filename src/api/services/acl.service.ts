import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import { Permission } from "role-acl";
import { UserACL } from "../acls/user.acl";

/**
 * Elastic search
 */
@singleton()
@autoInjectable()
export default class ACLService extends BaseService {
    public init() {
        return true;
    }

    public can(user: User, method: string, context: any, resource: string): Promise<Permission> {
        return UserACL.can(user.role)
            .context(context)
            .execute(method)
            .on(resource) as Promise<Permission>;
    }
}
