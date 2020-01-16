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
    protected repository: any;

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
                        .replace(/\/api\/v1\/?/, "");

                    cleanupRouteCache(routeType);
                } else {
                    cache.set(req.originalUrl, extracted);
                }
            }

            if (!res.headersSent) {
                res.json(extracted);
            }
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    protected beforeMethod() {
        return;
    }
}

export {BaseController};
