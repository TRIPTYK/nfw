import * as NodeCache from "node-cache";
import { singleton } from "tsyringe";

@singleton()
export class CacheService {
    private pcache: NodeCache;

    public get cache(): NodeCache {
        return this.pcache;
    }

    constructor() {
        this.pcache = new NodeCache({stdTTL: 180, checkperiod: 240});
    }

    public cleanupRouteCache(routeType) {
        for (const key of this.pcache.keys()) {
            if (key.includes(routeType)) {
                this.pcache.del(key);
            }
        }
    }
}
