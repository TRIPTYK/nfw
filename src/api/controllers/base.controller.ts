import {Connection, getConnection, getCustomRepository, getRepository, Repository} from "typeorm";
import {cache, cleanupRouteCache, IController} from "@triptyk/nfw-core";
import {caching_enabled, typeorm as TypeORM} from "../../config/environment.config";
import { BaseRepository } from "../repositories/base.repository";

/**
 * Main controller contains properties/methods
 * @abstract
 */
abstract class BaseController implements IController {

    /**
     * Store the TypeORM current connection to database
     * @property Connection
     * @property Connection
     */
    protected connection: Connection;
    protected repository: any;

    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     * @constructor
     */
    public constructor() {
        this.connection = getConnection(TypeORM.name);
    }

    public method = (method, {enableCache = true}: {enableCache?: boolean} = {}) => async (req, res, next) => {
        try {
            if (!this[method]) {
                next(new Error(`Controller does not have a method ${method}`));
            }

            const cacheEnabled = caching_enabled && enableCache;
            this.beforeMethod();

            if (cacheEnabled && req.method === "GET") {
                const cached: any = cache.get(req.originalUrl);
                if (cached !== undefined) {
                    res.json(cached);
                    return;
                }
            }
            const extracted = await this[method](req, res, next);

            if (cacheEnabled) {
                if (["PATCH", "DELETE", "PUT", "POST"].includes(req.method)) {
                    const routeType = req.originalUrl.split("?")[0]
                        .replace(/\/api\/v1\/(?:admin\/)?/, "");

                    cleanupRouteCache(routeType);
                } else {
                    cache.set(req.originalUrl, extracted);
                }
            }

            if (!res.headersSent) {
                res.json(extracted);
            }
        } catch (e) {
            next(e);
        }
    }

    protected beforeMethod() {
        return;
    }
}

export {BaseController};
