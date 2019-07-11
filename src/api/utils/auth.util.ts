import {RefreshTokenRepository} from "./../repositories/refresh-token.repository";
import {getCustomRepository} from "typeorm";
import {User} from "./../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";

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
const generateTokenResponse = async (user: User, accessToken: string): Promise<RefreshToken> => {
    const repo = getCustomRepository(RefreshTokenRepository);

    const oldToken = await repo.findOne({where: {user: user}});

    if (oldToken) await repo.remove(oldToken);

    const token = await repo.generate(user);
    token.accessToken = accessToken;
    return token;
};

export {generateTokenResponse};