"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var HttpStatus = require("http-status");
var Boom = require("boom");
var user_model_1 = require("./../models/user.model");
var refresh_token_model_1 = require("./../models/refresh-token.model");
var typeorm_1 = require("typeorm");
var user_repository_1 = require("./../repositories/user.repository");
var auth_util_1 = require("./../utils/auth.util");
var base_controller_1 = require("./base.controller");
/**
 *
 */
var AuthController = /** @class */ (function (_super) {
    __extends(AuthController, _super);
    /** */
    function AuthController() {
        return _super.call(this) || this;
    }
    /**
     * Create and save a new user
     *
     * @param req
     * @param res
     * @param next
     *
     * @return JWT|next
     *
     * @public
     */
    AuthController.prototype.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var repository, user, userTransformed, token, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        repository = typeorm_1.getRepository(user_model_1.User);
                        user = new user_model_1.User(req.body);
                        return [4 /*yield*/, repository.insert(user)];
                    case 1:
                        _a.sent();
                        userTransformed = user.whitelist();
                        return [4 /*yield*/, auth_util_1.generateTokenResponse(user, user.token())];
                    case 2:
                        token = _a.sent();
                        res.status(HttpStatus.CREATED);
                        return [2 /*return*/, res.json({ token: token, user: userTransformed })];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, next(user_model_1.User.checkDuplicateEmail(e_1))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Login with an existing user or creates a new one if valid accessToken token
     *
     * @param req
     * @param res
     * @param next
     *
     * @return JWT|next
     *
     * @public
     */
    AuthController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var repository, _a, user, accessToken, token, userTransformed, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
                        return [4 /*yield*/, repository.findAndGenerateToken(req.body)];
                    case 1:
                        _a = _b.sent(), user = _a.user, accessToken = _a.accessToken;
                        return [4 /*yield*/, auth_util_1.generateTokenResponse(user, accessToken)];
                    case 2:
                        token = _b.sent();
                        userTransformed = user.whitelist();
                        return [2 /*return*/, res.json({ token: token, user: userTransformed })];
                    case 3:
                        e_2 = _b.sent();
                        return [2 /*return*/, next(Boom.expectationFailed(e_2.message))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
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
    AuthController.prototype.oAuth = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, accessToken, token, userTransformed;
            return __generator(this, function (_a) {
                try {
                    user = req.body;
                    accessToken = user.token();
                    token = auth_util_1.generateTokenResponse(user, accessToken);
                    userTransformed = user.whitelist();
                    return [2 /*return*/, res.json({ token: token, user: userTransformed })];
                }
                catch (e) {
                    return [2 /*return*/, next(Boom.expectation.failed(e.message))];
                }
                return [2 /*return*/];
            });
        });
    };
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
    AuthController.prototype.refresh = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshTokenRepository, userRepository, token, refreshObject, _a, user, accessToken, response, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        refreshTokenRepository = typeorm_1.getRepository(refresh_token_model_1.RefreshToken);
                        userRepository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
                        token = req.body.token;
                        return [4 /*yield*/, refreshTokenRepository.findOne({
                                where: { token: token.refreshToken }
                            })];
                    case 1:
                        refreshObject = _b.sent();
                        if (typeof (refreshObject) === 'undefined')
                            return [2 /*return*/, next(Boom.expectationFailed('RefreshObject cannot be empty'))];
                        refreshTokenRepository.remove(refreshObject);
                        return [4 /*yield*/, userRepository.findAndGenerateToken({ email: refreshObject.user.email, refreshObject: refreshObject })];
                    case 2:
                        _a = _b.sent(), user = _a.user, accessToken = _a.accessToken;
                        ;
                        return [4 /*yield*/, auth_util_1.generateTokenResponse(user, accessToken)];
                    case 3:
                        response = _b.sent();
                        return [2 /*return*/, res.json({ token: response })];
                    case 4:
                        e_3 = _b.sent();
                        console.log(e_3.message);
                        throw next(Boom.expectationFailed(e_3.message));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}(base_controller_1.BaseController));
exports.AuthController = AuthController;
;
