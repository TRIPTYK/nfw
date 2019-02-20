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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var user_model_1 = require("./../models/user.model");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var v4_1 = require("uuid/v4");
var Moment = require("moment-timezone");
var Boom = require("boom");
var UserRepository = /** @class */ (function (_super) {
    __extends(UserRepository, _super);
    /** */
    function UserRepository() {
        return _super.call(this) || this;
    }
    /**
     * Get one user
     *
     * @param {number} id - The id of user
     *
     * @returns {User}
     */
    UserRepository.prototype.one = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, typeorm_1.getRepository(user_model_1.User).findOne(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw Boom.notFound('User not found');
                        }
                        return [2 /*return*/, user];
                    case 2:
                        e_1 = _a.sent();
                        throw Boom.expectationFailed(e_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a list of users according to current query parameters
     *
     */
    UserRepository.prototype.list = function (_a) {
        var _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.perPage, perPage = _c === void 0 ? 30 : _c, username = _a.username, email = _a.email, lastname = _a.lastname, firstname = _a.firstname, role = _a.role;
        try {
            var repository = typeorm_1.getRepository(user_model_1.User);
            var options = lodash_1.omitBy({ username: username, email: email, lastname: lastname, firstname: firstname, role: role }, lodash_1.isNil);
            return repository.find({
                where: options,
                skip: (page - 1) * perPage,
                take: perPage
            });
        }
        catch (e) {
            throw Boom.expectationFailed(e.message);
        }
    };
    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {Object} - Payload data
     *
     * @returns {Object|Error}
     */
    UserRepository.prototype.findAndGenerateToken = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, refreshObject, user, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        email = options.email, password = options.password, refreshObject = options.refreshObject;
                        if (!email)
                            throw Boom.badRequest('An email is required to generate a token');
                        return [4 /*yield*/, this.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!!user) return [3 /*break*/, 2];
                        throw Boom.notFound('User not found');
                    case 2:
                        _a = password;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, user.passwordMatches(password)];
                    case 3:
                        _a = (_b.sent()) === false;
                        _b.label = 4;
                    case 4:
                        if (_a) {
                            throw Boom.unauthorized('Password must match to authorize a token generating');
                        }
                        else if (refreshObject && refreshObject.user.email === email && Moment(refreshObject.expires).isBefore()) {
                            throw Boom.unauthorized('Invalid refresh token.');
                        }
                        _b.label = 5;
                    case 5: return [2 /*return*/, { user: user, accessToken: user.token() }];
                }
            });
        });
    };
    /**
     *
     * @param param
     */
    UserRepository.prototype.oAuthLogin = function (_a) {
        var service = _a.service, id = _a.id, email = _a.email, username = _a.username, picture = _a.picture;
        return __awaiter(this, void 0, void 0, function () {
            var _b, userRepository, user, password, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userRepository = typeorm_1.getRepository(user_model_1.User);
                        return [4 /*yield*/, userRepository.findOne({
                                where: { email: email }
                            })];
                    case 1:
                        user = _c.sent();
                        if (user) {
                            user.services[service] = id;
                            if (!user.username)
                                user.username = username;
                            //if (!user.documents) user.documents = document; // TODO: manage picture
                            return [2 /*return*/, userRepository.save(user)];
                        }
                        password = v4_1.uuidv4();
                        // return userRepository.create({ services: { [service]: id }, email, password, username, picture }); // TODO: manage picture
                        return [2 /*return*/, userRepository.create({ services: (_b = {}, _b[service] = id, _b), email: email, password: password, username: username })];
                    case 2:
                        e_2 = _c.sent();
                        throw Boom.expectationFailed(e_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository = __decorate([
        typeorm_1.EntityRepository(user_model_1.User)
    ], UserRepository);
    return UserRepository;
}(typeorm_1.Repository));
exports.UserRepository = UserRepository;
