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
const Moment = require("moment-timezone");
const Crypto = require("crypto");
const boom_1 = require("boom");
const refresh_token_model_1 = require("./../models/refresh-token.model");
const typeorm_1 = require("typeorm");
let RefreshTokenRepository = class RefreshTokenRepository extends typeorm_1.Repository {
    /** */
    constructor() { super(); }
    /**
     *
     * @param user
     */
    generate(user) {
        try {
            const token = `${user.id}.${Crypto.randomBytes(40).toString('hex')}`;
            const expires = Moment().add(30, 'days').toDate();
            const tokenObject = new refresh_token_model_1.RefreshToken(token, user, expires);
            this.save(tokenObject);
            return tokenObject;
        }
        catch (e) {
            throw boom_1.Boom.expectationFailed(e.message);
        }
    }
};
RefreshTokenRepository = __decorate([
    typeorm_1.EntityRepository(refresh_token_model_1.RefreshToken),
    __metadata("design:paramtypes", [])
], RefreshTokenRepository);
exports.RefreshTokenRepository = RefreshTokenRepository;
