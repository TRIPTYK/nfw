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
const typeorm_1 = require("typeorm");
const environment_config_1 = require("./../../config/environment.config");
const document_model_1 = require("./../models/document.model");
const role_enum_1 = require("./../enums/role.enum");
const user_serializer_1 = require("./../serializers/user.serializer");
const Moment = require("moment-timezone");
const Jwt = require("jwt-simple");
const Bcrypt = require("bcrypt");
const Boom = require("boom");
let User = class User {
    /**
     * @param payload Object data to assign
     */
    constructor(payload) { Object.assign(this, payload); }
    storeTemporaryPassword() {
        this.temporaryPassword = this.password;
    }
    async hashPassword() {
        try {
            if (this.temporaryPassword === this.password)
                return true;
            const rounds = environment_config_1.env === 'test' ? 1 : 10;
            const hash = await Bcrypt.hash(this.password, rounds);
            this.password = hash;
            return true;
        }
        catch (error) {
            throw Boom.badImplementation(error.message);
        }
    }
    /**
     * @return Serialized user object in JSON-API format
     */
    whitelist() {
        return new user_serializer_1.UserSerializer().serialize(this);
    }
    /**
     *
     */
    token() {
        const payload = {
            exp: Moment().add(environment_config_1.jwtExpirationInterval, 'minutes').unix(),
            iat: Moment().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, environment_config_1.jwtSecret);
    }
    /**
     * @param password
     */
    async passwordMatches(password) {
        return Bcrypt.compare(password, this.password);
    }
    /**
     * @param error
     */
    static checkDuplicateEmail(error) {
        if (error.name === 'QueryFailedError' && error.errno === 1062) {
            return Boom.conflict('Validation error', {
                errors: [{
                        field: 'email',
                        location: 'body',
                        messages: ['"Email or Username" already exists'],
                    }]
            });
        }
        return error;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 32,
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({
        length: 128
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        length: 128,
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-json"
    }),
    __metadata("design:type", Object)
], User.prototype, "services", void 0);
__decorate([
    typeorm_1.Column({
        length: 32,
    }),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    typeorm_1.Column({
        length: 32,
    }),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    typeorm_1.OneToMany(type => document_model_1.Document, document => document.user),
    __metadata("design:type", Array)
], User.prototype, "documents", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: role_enum_1.roles,
        default: "ghost"
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Object)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        nullable: true
    }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: Date,
        default: null
    }),
    __metadata("design:type", Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "storeTemporaryPassword", null);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
