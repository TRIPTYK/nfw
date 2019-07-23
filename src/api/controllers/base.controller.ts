import {Connection, getConnection} from "typeorm";
import {caching_enabled, typeorm as TypeORM} from "./../../config/environment.config";
import {BaseRepository} from "../repositories/base.repository";
import {cache, cleanupRouteCache} from "../../config/cache.config";

/**
 * Main controller contains properties/methods
 * @abstract
 */
abstract class BaseController {

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
    constructor() {
        this.connection = getConnection(TypeORM.name);
    }

    public method = (method) => async (req, res, next) => {
        try {
            this.beforeMethod();

            if (caching_enabled && req.method === "GET") {
                const cached = cache.get(req.originalUrl);
                if (cached !== undefined) {
                    res.json(cached);
                    return;
                }
            }

            const extracted = await this[method](req, res, next);

            if (caching_enabled) {
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

    protected abstract beforeMethod();
}

export {BaseController};
