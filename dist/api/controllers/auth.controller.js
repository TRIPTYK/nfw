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
var HttpStatus = require("http-status");
var User = require("./../models/user.model");
var RefreshToken = require("./../models/refresh-token.model");
var Moment = require("moment-timezone");
var jwtExpirationInterval = require('./../../config/environment.config').jwtExpirationInterval;
/**
* Build a token response and return it
*
* @param {Object} user
* @param {String} accessToken
*
* @returns A formated object with tokens
*
* @private
*/
var _generateTokenResponse = function (user, accessToken) {
    var tokenType = 'Bearer';
    var refreshToken = RefreshToken.generate(user).token;
    var expiresIn = Moment().add(jwtExpirationInterval, 'minutes');
    return { tokenType: tokenType, accessToken: accessToken, refreshToken: refreshToken, expiresIn: expiresIn };
};
/**
 * Create and save a new user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @return JWT|next
 *
 * @public
 */
exports.register = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, userTransformed, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (new User(req.body)).save()];
            case 1:
                user = _a.sent();
                userTransformed = user.transform();
                token = _generateTokenResponse(user, user.token());
                res.status(HttpStatus.CREATED);
                return [2 /*return*/, res.json({ token: token, user: userTransformed })];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, next(User.checkDuplicateEmail(error_1))];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Connect user if valid username and password is provided
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @return JWT|next
 *
 * @public
 */
exports.login = function (eq, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, user, accessToken, token, userTransformed, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User.findAndGenerateToken(req.body)];
            case 1:
                _a = _b.sent(), user = _a.user, accessToken = _a.accessToken;
                token = _generateTokenResponse(user, accessToken);
                userTransformed = user.transform();
                return [2 /*return*/, res.json({ token: token, user: userTransformed })];
            case 2:
                error_2 = _b.sent();
                return [2 /*return*/, next(error_2)];
            case 3: return [2 /*return*/];
        }
    });
}); };
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
exports.oAuth = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, accessToken, token, userTransformed;
    return __generator(this, function (_a) {
        try {
            user = req.user;
            accessToken = user.token();
            token = _generateTokenResponse(user, accessToken);
            userTransformed = user.transform();
            return [2 /*return*/, res.json({ token: token, user: userTransformed })];
        }
        catch (error) {
            return [2 /*return*/, next(error)];
        }
        return [2 /*return*/];
    });
}); };
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
exports.refresh = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, email, refreshToken, refreshObject, _b, user, accessToken, response, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, refreshToken = _a.refreshToken;
                return [4 /*yield*/, RefreshToken.findOneAndRemove({
                        userEmail: email,
                        token: refreshToken,
                    })];
            case 1:
                refreshObject = _c.sent();
                return [4 /*yield*/, User.findAndGenerateToken({ email: email, refreshObject: refreshObject })];
            case 2:
                _b = _c.sent(), user = _b.user, accessToken = _b.accessToken;
                response = _generateTokenResponse(user, accessToken);
                return [2 /*return*/, res.json(response)];
            case 3:
                error_3 = _c.sent();
                return [2 /*return*/, next(error_3)];
            case 4: return [2 /*return*/];
        }
    });
}); };
