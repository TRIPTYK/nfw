import {IController} from "@triptyk/nfw-core";
import EnvironmentConfiguration from "../../config/environment.config";
import { container } from "tsyringe";
import { CacheService } from "../services/cache.services";
import { BaseModel } from "../models/base.model";
import { Repository, getCustomRepository, ObjectType } from "typeorm";
import { BaseRepository } from "../repositories/base.repository";

/**
 * Main controller contains properties/methods
 * @abstract
 */
export default abstract class BaseEntityController<T extends BaseModel> implements IController {
    protected repository: BaseRepository<T>;

    protected constructor(entity: ObjectType<BaseRepository<T>>) {
        this.repository = getCustomRepository(entity);
    }

    public method = (method: keyof this, {enableCache = true}: {enableCache?: boolean} = {}) => async (req, res, next) => {
        try {
            const cacheService = container.resolve(CacheService);
            const cacheEnabled = EnvironmentConfiguration.config.caching_enabled && enableCache;

            await this.beforeMethod({method, enableCache});

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

    protected async beforeMethod(options: object): Promise<any> {
        return;
    }
}
