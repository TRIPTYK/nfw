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
exports.__esModule = true;
var Moment = require("moment-timezone");
var Crypto = require("crypto");
var boom_1 = require("boom");
var refresh_token_model_1 = require("./../models/refresh-token.model");
var typeorm_1 = require("typeorm");
var RefreshTokenRepository = /** @class */ (function (_super) {
    __extends(RefreshTokenRepository, _super);
    /** */
    function RefreshTokenRepository() {
        return _super.call(this) || this;
    }
    /**
     *
     * @param user
     */
    RefreshTokenRepository.prototype.generate = function (user) {
        try {
            var token = user.id + "." + Crypto.randomBytes(40).toString('hex');
            var expires = Moment().add(30, 'days').toDate();
            var tokenObject = new refresh_token_model_1.RefreshToken(token, user, expires);
            this.save(tokenObject);
            return tokenObject;
        }
        catch (e) {
            throw boom_1.Boom.expectationFailed(e.message);
        }
    };
    RefreshTokenRepository = __decorate([
        typeorm_1.EntityRepository(refresh_token_model_1.RefreshToken)
    ], RefreshTokenRepository);
    return RefreshTokenRepository;
}(typeorm_1.Repository));
exports.RefreshTokenRepository = RefreshTokenRepository;
