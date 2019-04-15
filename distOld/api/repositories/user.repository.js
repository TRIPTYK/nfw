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
const user_model_1 = require("./../models/user.model");
const typeorm_1 = require("typeorm");
const v4_1 = require("uuid/v4");
const Moment = require("moment-timezone");
const Boom = require("boom");
const base_repository_1 = require("./base.repository");
let UserRepository = class UserRepository extends base_repository_1.BaseRepository {
    /** */
    constructor() { super(); }
    /**
     * Get one user
     *
     * @param {number} id - The id of user
     *
     * @returns {User}
     */
    async one(id) {
        try {
            let user = await typeorm_1.getRepository(user_model_1.User).findOne(id);
            if (!user) {
                throw Boom.notFound('User not found');
            }
            return user;
        }
        catch (e) {
            throw Boom.expectationFailed(e.message);
        }
    }
    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param options email , password and refreshObject
     *
     * @returns
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email)
            throw Boom.badRequest('An email is required to generate a token');
        const user = await this.findOne({ email });
        if (!user) {
            throw Boom.notFound('User not found');
        }
        else if (password && await user.passwordMatches(password) === false) {
            throw Boom.unauthorized('Password must match to authorize a token generating');
        }
        else if (refreshObject && refreshObject.user.email === email && Moment(refreshObject.expires).isBefore()) {
            throw Boom.unauthorized('Invalid refresh token.');
        }
        return { user, accessToken: user.token() };
    }
    /**
     *
     * @param param
     */
    async oAuthLogin({ service, id, email, username, picture }) {
        try {
            const userRepository = typeorm_1.getRepository(user_model_1.User);
            const user = await userRepository.findOne({
                where: { email: email },
            });
            if (user) {
                user.services[service] = id;
                if (!user.username)
                    user.username = username;
                //if (!user.documents) user.documents = document; // TODO: manage picture
                return userRepository.save(user);
            }
            const password = v4_1.uuidv4();
            // return userRepository.create({ services: { [service]: id }, email, password, username, picture }); // TODO: manage picture
            return userRepository.create({ services: { [service]: id }, email, password, username });
        }
        catch (e) {
            throw Boom.expectationFailed(e.message);
        }
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(user_model_1.User),
    __metadata("design:paramtypes", [])
], UserRepository);
exports.UserRepository = UserRepository;
