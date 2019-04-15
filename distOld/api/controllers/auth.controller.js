"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status");
const Boom = require("boom");
const user_model_1 = require("./../models/user.model");
const refresh_token_model_1 = require("./../models/refresh-token.model");
const typeorm_1 = require("typeorm");
const user_repository_1 = require("./../repositories/user.repository");
const auth_util_1 = require("./../utils/auth.util");
const base_controller_1 = require("./base.controller");
/**
 * Authentification Controller!
 * @module controllers/auth.controller.ts
 */
class AuthController extends base_controller_1.BaseController {
    /**
     * @constructor
    */
    constructor() { super(); }
    /**
     * Create and save a new user
     *
     * @param {Object} req
     * @param {Object}res
     * @param {Function}next
     *
     * @return JWT|next
     *
     * @public
     */
    async register(req, res, next) {
        try {
            const repository = typeorm_1.getRepository(user_model_1.User);
            let user = new user_model_1.User(req.body);
            await repository.insert(user);
            const userTransformed = user.whitelist();
            const token = await auth_util_1.generateTokenResponse(user, user.token());
            res.status(HttpStatus.CREATED);
            return res.json({ token, user: userTransformed });
        }
        catch (e) {
            return next(user_model_1.User.checkDuplicateEmail(e));
        }
    }
    /**
     * Login with an existing user or creates a new one if valid accessToken token
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     *
     * @return JWT|next
     *
     * @public
     */
    async login(req, res, next) {
        try {
            const repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
            const { user, accessToken } = await repository.findAndGenerateToken(req.body);
            const token = await auth_util_1.generateTokenResponse(user, accessToken);
            const userTransformed = user.whitelist();
            return res.json({ token, user: userTransformed });
        }
        catch (e) {
            return next(Boom.expectationFailed(e.message));
        }
    }
    /**
     * Login with an existing user or creates a new one if valid accessToken token
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     *
     * @return JWT|next
     *
     * @public
     */
    async oAuth(req, res, next) {
        try {
            const user = req.body;
            const accessToken = user.token();
            const token = auth_util_1.generateTokenResponse(user, accessToken);
            const userTransformed = user.whitelist();
            return res.json({ token, user: userTransformed });
        }
        catch (e) {
            return next(Boom.expectation.failed(e.message));
        }
    }
    /**
     * Refresh JWT token by RefreshToken removing, and re-creating
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     *
     * @return JWT|next
     *
     * @public
     */
    async refresh(req, res, next) {
        try {
            const refreshTokenRepository = typeorm_1.getRepository(refresh_token_model_1.RefreshToken);
            const userRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
            const { token } = req.body;
            const refreshObject = await refreshTokenRepository.findOne({
                where: { token: token.refreshToken }
            });
            if (typeof (refreshObject) === 'undefined')
                return next(Boom.expectationFailed('RefreshObject cannot be empty'));
            refreshTokenRepository.remove(refreshObject);
            // Get owner user of the token
            const { user, accessToken } = await userRepository.findAndGenerateToken({ email: refreshObject.user.email, refreshObject });
            ;
            const response = await auth_util_1.generateTokenResponse(user, accessToken);
            return res.json({ token: response });
        }
        catch (e) {
            console.log(e.message);
            throw next(Boom.expectationFailed(e.message));
        }
    }
}
exports.AuthController = AuthController;
;
