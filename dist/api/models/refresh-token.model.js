"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Crypto = require('crypto'), Moment = require('moment-timezone');
var typeorm_1 = require("typeorm");
var RefreshToken = /** @class */ (function () {
    function RefreshToken() {
    }
    var _a;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], RefreshToken.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], RefreshToken.prototype, "token", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], RefreshToken.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", typeof (_a = typeof date !== "undefined" && date) === "function" ? _a : Object)
    ], RefreshToken.prototype, "expires", void 0);
    RefreshToken = __decorate([
        typeorm_1.Entity()
    ], RefreshToken);
    return RefreshToken;
}());
exports.RefreshToken = RefreshToken;
/*
RefreshToken.prototype.generate = (user: User) => {

  const userId = user._id;
  const userEmail = user.email;
  const token = `${userId}.${Crypto.randomBytes(40).toString('hex')}`;
  const expires = Moment().add(30, 'days').toDate();

  const tokenObject = new RefreshToken({
    token, userId, userEmail, expires,
  });

  tokenObject.save();
  return tokenObject;
};
*/
exports.generate = function (user) {
    var userId = user._id;
    var userEmail = user.email;
    var token = userId + "." + Crypto.randomBytes(40).toString('hex');
    var expires = Moment().add(30, 'days').toDate();
    var tokenObject = new RefreshToken({ token: token, userId: userId, userEmail: userEmail, expires: expires });
    tokenObject.save();
    return tokenObject;
};
