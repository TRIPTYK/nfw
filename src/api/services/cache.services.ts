import * as NodeCache from "node-cache";
import { singleton } from "tsyringe";

@singleton()
export class CacheService {
    private pcache: NodeCache;

    public get cache(): NodeCache {
        return this.pcache;
    }

    public constructor() {
        this.pcache = new NodeCache({stdTTL: 180, checkperiod: 240});
    }

    public cleanupRouteCache(filterFnc): boolean {
        for (const key of this.pcache.keys()) {
            if (filterFnc(key)) {
                this.pcache.del(key);
            }
        }
        return true;
    }
}
