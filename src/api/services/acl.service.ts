import { injectable, singleton } from '@triptyk/nfw-core';

@injectable()
@singleton()
export class AclService {
    private enforcer?: any;

    public async enforce (subject: Record<string, unknown>, obj: unknown, act: string) {
      if (!this.enforcer) {
        this.enforcer = undefined;
      }

      return await this.enforcer.enforce(subject, obj, act);
    }
}
