import * as NodeCache from "node-cache";

const cache = new NodeCache({stdTTL: 180, checkperiod: 240});

const cleanupRouteCache = (routeType) => {
    for (const key of cache.keys())
        if (key.includes(routeType))
            cache.del(key);
};

export {cache, cleanupRouteCache};