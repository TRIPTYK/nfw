"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("./../models/user.model");
var HttpStatus = require("http-status");
var environment_config_1 = require("./../../config/environment.config");
var userRepository = environment_config_1.db.getRepository(user_model_1.User);
/**
 * Get serialized user
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.get = function (req, res) { return res.json(req.locals.user.transform()); };
/**
 * Get logged in user info
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.loggedIn = function (req, res) { return res.json(req.user.transform()); };
/**
 * Create new user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @public
 */
exports.create = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, savedUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = userRepository.create(req.body);
                return [4 /*yield*/, userRepository.save(user)];
            case 1:
                savedUser = _a.sent();
                res.status(HttpStatus.CREATED);
                res.json(savedUser.transform());
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(user_model_1.User.checkDuplicateEmail(error_1));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Replace existing user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @public
 */
exports.replace = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userRepository.findOne(req.params.userId)];
            case 1:
                user = _a.sent();
                userRepository.merge(user, req.body);
                userRepository.save(user);
                res.json(user.transform());
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(user_model_1.User.checkDuplicateEmail(error_2));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Update existing user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @public
 */
exports.update = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userRepository.findOne(req.params.userId)];
            case 1:
                user = _a.sent();
                userRepository.merge(user, req.body);
                userRepository.save(user);
                res.json(user.transform());
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                next(user_model_1.User.checkDuplicateEmail(e_1));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Get user list
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @public
 */
exports.list = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var users, transformedUsers, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_model_1.User.list(req.query)];
            case 1:
                users = _a.sent();
                transformedUsers = users.map(function (user) { return user.transform(); });
                res.json(transformedUsers);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Delete user
 * @public
 */
exports.remove = function (req, res, next) {
    try {
        var user = req.locals.user;
        user
            .remove()
            .then(function () { return res.status(HttpStatus.NO_CONTENT).end(); })
            .catch(function (e) { return next(e); });
    }
    catch (e) {
        next(e);
    }
};
