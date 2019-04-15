"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refresh_token_repository_1 = require("./../repositories/refresh-token.repository");
const environment_config_1 = require("./../../config/environment.config");
const typeorm_1 = require("typeorm");
const refresh_token_model_1 = require("./../models/refresh-token.model");
const Moment = require("moment-timezone");
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
const generateTokenResponse = async (user, accessToken) => {
    const tokenType = 'Bearer';
    const oldToken = await typeorm_1.getRepository(refresh_token_model_1.RefreshToken).findOne({ where: { user: user } });
    if (oldToken) {
        const deleted = await typeorm_1.getRepository(refresh_token_model_1.RefreshToken).remove(oldToken);
    }
    const refreshToken = typeorm_1.getCustomRepository(refresh_token_repository_1.RefreshTokenRepository).generate(user).token;
    const expiresIn = Moment().add(environment_config_1.jwtExpirationInterval, 'minutes');
    return { tokenType, accessToken, refreshToken, expiresIn };
};
exports.generateTokenResponse = generateTokenResponse;
