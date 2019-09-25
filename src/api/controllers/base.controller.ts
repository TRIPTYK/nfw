import {Connection, getConnection} from "typeorm";
import {cache, cleanupRouteCache} from "../../config/cache.config";
import {caching_enabled, typeorm as TypeORM} from "nfw-core";
import {BaseRepository} from "nfw-core";
import {IController} from "nfw-core";

/**
 * Main controller contains properties/methods
 * @abstract
 */
abstract class BaseController implements IController {

    /**
     * Store the TypeORM current connection to database
     * @property Connection
     */
    protected connection: Connection;
    protected repository: BaseRepository<any>;

    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     * @constructor
     */
    protected constructor() {
        this.connection = getConnection(TypeORM.name);
    }

    public method = (method,{enableCache = true} : {enableCache : boolean}) => async (req, res, next) => {
        try {
            const cacheEnabled = caching_enabled && enableCache;
            this.beforeMethod();

            if (cacheEnabled && req.method === "GET") {
                const cached : any = cache.get(req.originalUrl);
                if (cached !== undefined) {
                    res.json(cached);
                    return;
                }
            }

            const extracted = await this[method](req, res, next);

            if (cacheEnabled) {
                if (['PATCH', 'DELETE', 'PUT', 'POST'].includes(req.method)) {
                    let routeType = req.originalUrl.split('?')[0]
                        .replace(/\/api\/v1\/(?:admin\/)?/, '');

                    cleanupRouteCache(routeType);
                } else {
                    cache.set(req.originalUrl, extracted);
                }
            }

            if (!res.headersSent)
                res.json(extracted);
        } catch (e) {
            next(e);
        }
    };

    protected beforeMethod() {

    }
}

export {BaseController};
