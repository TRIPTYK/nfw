import {IController, JsonApiRepositoryInterface, fullLog} from "@triptyk/nfw-core";
import EnvironmentConfiguration from "../../config/environment.config";
import { container } from "tsyringe";
import { CacheService } from "../services/cache.services";
import { BaseRepository } from "../repositories/base.repository";

/**
 * Main controller contains properties/methods
 * @abstract
 */
abstract class BaseController<T> implements IController {

    /**
     * Store the TypeORM current connection to database
     * @property Connection
     * @property Connection
     */
    protected repository: BaseRepository<T>;

    public method = (method: keyof this, {enableCache = true}: {enableCache?: boolean} = {}) => async (req, res, next) => {
        try {
            const cacheService = container.resolve(CacheService);

            if (!this[method]) {
                next(new Error(`Controller does not have a method ${method}`));
            }

            const cacheEnabled = EnvironmentConfiguration.config.caching_enabled && enableCache;

            await this.beforeMethod();

            if (cacheEnabled && req.method === "GET") {
                const cached: any = cacheService.cache.get(req.originalUrl);
                if (cached !== undefined) {
                    res.json(cached);
                    return;
                }
            }
            const extracted = await (this as any)[method](req, res, next);

            if (cacheEnabled) {
                if (["PATCH", "DELETE", "PUT", "POST"].includes(req.method)) {
                    const routeType = req.originalUrl.split("?")[0]
                        .replace(/\/api\/v1\/?/, "");

                    cacheService.cleanupRouteCache(routeType);
                } else {
                    cacheService.cache.set(req.originalUrl, extracted);
                }
            }

            if (!res.headersSent) {
                res.json(extracted);
            }
        } catch (e) {
            next(e);
        }
    }

    protected async beforeMethod() {
        return;
    }
}

export {BaseController};
