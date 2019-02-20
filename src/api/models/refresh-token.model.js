"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var user_model_1 = require("./../models/user.model");
var RefreshToken = /** @class */ (function () {
    /**
     *
     * @param token
     * @param user
     * @param expires
     */
    function RefreshToken(token, user, expires) {
        this.token = token;
        this.expires = expires;
        this.user = user;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], RefreshToken.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], RefreshToken.prototype, "token");
    __decorate([
        typeorm_1.OneToOne(function (type) { return user_model_1.User; }, {
            eager: true,
            onDelete: "CASCADE" // Remove refresh-token when user is deleted
        }),
        typeorm_1.JoinColumn()
    ], RefreshToken.prototype, "user");
    __decorate([
        typeorm_1.Column()
    ], RefreshToken.prototype, "expires");
    RefreshToken = __decorate([
        typeorm_1.Entity()
    ], RefreshToken);
    return RefreshToken;
}());
exports.RefreshToken = RefreshToken;
