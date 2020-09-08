import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import { Permission, AccessControl } from "role-acl";

/**
 * Elastic search
 */
@singleton()
@autoInjectable()
export default class ACLService extends BaseService {
    public init() {
        return true;
    }

    public can(user: User,method: string,context: any,resource: string): Promise<Permission> {
        const acl = new AccessControl();
        return acl.can(user)
            .context(context)
            .execute(method)
            .on(resource) as Promise<Permission>;
    }
}
