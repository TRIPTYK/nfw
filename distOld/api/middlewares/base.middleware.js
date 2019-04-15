"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("boom");
class BaseMiddleware {
    constructor(serializer) {
        /**
         * Deserialize a POST-PUT-PATCH-DELETE request
         *
         * @param req Request object
         * @param res Response object
         * @param next Next middleware function
         */
        this.deserialize = async (req, _res, next) => {
            try {
                if (['GET', 'DELETE'].includes(req.method))
                    return next();
                if (!req.body.data || !req.body.data.attributes)
                    return next();
                let fields = await this.serializer.deserialize(req);
                req.body = {};
                for (let key in fields) {
                    if (key !== 'id') {
                        req.body[key] = fields[key];
                    }
                    else
                        delete req.body[key];
                }
                return next();
            }
            catch (e) {
                return next(Boom.expectationFailed(e.message));
            }
        };
        this.serializer = serializer;
    }
}
exports.BaseMiddleware = BaseMiddleware;
