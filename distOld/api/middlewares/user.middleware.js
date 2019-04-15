"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("boom");
const user_repository_1 = require("./../repositories/user.repository");
const typeorm_1 = require("typeorm");
const user_model_1 = require("./../models/user.model");
const user_serializer_1 = require("./../serializers/user.serializer");
const base_middleware_1 = require("./base.middleware");
class UserMiddleware extends base_middleware_1.BaseMiddleware {
    constructor() {
        super(new user_serializer_1.UserSerializer());
        /**
         * Load user and append to req
         *
         * @param req Request object
         * @param res Response object
         * @param next Next middleware function
         * @param id User id
         *
         */
        this.load = async (req, res, next, id) => {
            try {
                const repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
                req['locals'] = new user_model_1.User(await repository.one(id));
                return next();
            }
            catch (e) {
                return next(Boom.expectationFailed(e.message));
            }
        };
    }
}
exports.UserMiddleware = UserMiddleware;
;
