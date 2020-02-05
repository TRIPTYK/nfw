import * as NodeCache from "node-cache";
import { singleton, injectable } from "tsyringe";

@injectable()
export class CacheService {
    private pcache: NodeCache;

    public get cache(): NodeCache {
        return this.pcache;
    }

    constructor() {
        this.pcache = new NodeCache({stdTTL: 180, checkperiod: 240});
    }

    public async cleanupRouteCache(filterFnc) {
        for (const key of this.pcache.keys()) {
            if (filterFnc(key)) {
                this.pcache.del(key);
            }
        }
        return true;
    }
}
