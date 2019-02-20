"use strict";
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
var typeorm_1 = require("typeorm");
var environment_config_1 = require("./../../config/environment.config");
var DateUtils_1 = require("typeorm/util/DateUtils");
var document_model_1 = require("./../models/document.model");
var role_enum_1 = require("./../enums/role.enum");
var user_serializer_1 = require("./../serializers/user.serializer");
var Moment = require("moment-timezone");
var Jwt = require("jwt-simple");
var Bcrypt = require("bcrypt");
var Boom = require("boom");
var User = /** @class */ (function () {
    /**
     * @param payload Object data to assign
     */
    function User(payload) {
        Object.assign(this, payload);
    }
    User.prototype.storeTemporaryPassword = function () {
        this.temporaryPassword = this.password;
    };
    User.prototype.hashPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rounds, hash, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.temporaryPassword === this.password)
                            return [2 /*return*/, true];
                        rounds = environment_config_1.env === 'test' ? 1 : 10;
                        return [4 /*yield*/, Bcrypt.hash(this.password, rounds)];
                    case 1:
                        hash = _a.sent();
                        this.password = hash;
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        throw Boom.badImplementation(error_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.whitelist = function () {
        return new user_serializer_1.UserSerializer().serializer.serialize(this);
    };
    /**
     *
     */
    User.prototype.token = function () {
        var payload = {
            exp: Moment().add(environment_config_1.jwtExpirationInterval, 'minutes').unix(),
            iat: Moment().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, environment_config_1.jwtSecret);
    };
    /**
     *
     * @param password
     */
    User.prototype.passwordMatches = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Bcrypt.compare(password, this.password)];
            });
        });
    };
    /**
     * @param error
     */
    User.checkDuplicateEmail = function (error) {
        if (error.name === 'QueryFailedError' && error.errno === 1062) {
            return Boom.conflict('Validation error', {
                errors: [{
                        field: 'email',
                        location: 'body',
                        messages: ['"Email or Username" already exists']
                    }]
            });
        }
        return error;
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], User.prototype, "id");
    __decorate([
        typeorm_1.Column({
            length: 32,
            unique: true
        })
    ], User.prototype, "username");
    __decorate([
        typeorm_1.Column({
            length: 128
        })
    ], User.prototype, "password");
    __decorate([
        typeorm_1.Column({
            length: 128,
            unique: true
        })
    ], User.prototype, "email");
    __decorate([
        typeorm_1.Column({
            type: "simple-json"
        })
    ], User.prototype, "services");
    __decorate([
        typeorm_1.Column({
            length: 32
        })
    ], User.prototype, "firstname");
    __decorate([
        typeorm_1.Column({
            length: 32
        })
    ], User.prototype, "lastname");
    __decorate([
        typeorm_1.OneToMany(function (type) { return document_model_1.Document; }, function (document) { return document.user; }, {
            eager: true
        })
    ], User.prototype, "documents");
    __decorate([
        typeorm_1.Column({
            type: "enum",
            "enum": role_enum_1.roles,
            "default": "ghost"
        })
    ], User.prototype, "role");
    __decorate([
        typeorm_1.Column({
            type: Date,
            "default": DateUtils_1.DateUtils.mixedDateToDateString(new Date())
        })
    ], User.prototype, "createdAt");
    __decorate([
        typeorm_1.Column({
            type: Date,
            "default": null
        })
    ], User.prototype, "updatedAt");
    __decorate([
        typeorm_1.Column({
            type: Date,
            "default": null
        })
    ], User.prototype, "deletedAt");
    __decorate([
        typeorm_1.AfterLoad()
    ], User.prototype, "storeTemporaryPassword");
    __decorate([
        typeorm_1.BeforeInsert(),
        typeorm_1.BeforeUpdate()
    ], User.prototype, "hashPassword");
    User = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
