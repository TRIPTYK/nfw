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
var Boom = require("boom");
var user_repository_1 = require("./../repositories/user.repository");
var typeorm_1 = require("typeorm");
var user_model_1 = require("./../models/user.model");
var user_serializer_1 = require("./../serializers/user.serializer");
var base_middleware_1 = require("./base.middleware");
var UserMiddleware = /** @class */ (function (_super) {
    __extends(UserMiddleware, _super);
    function UserMiddleware() {
        var _this = _super.call(this, new user_serializer_1.UserSerializer()) || this;
        /**
         * Load user and append to req
         *
         * @param {Object} req
         * @param {Object} res
         * @param {Function} next
         * @param {String} id
         *
         * @returns {Function}
         *
         * @public
         */
        _this.load = function (req, res, next, id) { return __awaiter(_this, void 0, void 0, function () {
            var repository, _a, _b, _c, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        repository = typeorm_1.getCustomRepository(user_repository_1.UserRepository);
                        _a = req;
                        _b = 'locals';
                        _c = user_model_1.User.bind;
                        return [4 /*yield*/, repository.one(id)];
                    case 1:
                        _a[_b] = new (_c.apply(user_model_1.User, [void 0, _d.sent()]))();
                        return [2 /*return*/, next()];
                    case 2:
                        e_1 = _d.sent();
                        return [2 /*return*/, next(Boom.expectationFailed(e_1.message))];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return UserMiddleware;
}(base_middleware_1.BaseMiddleware));
exports.UserMiddleware = UserMiddleware;
;
