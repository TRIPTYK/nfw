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
 * @param ip
 * @returns A formated object with tokens
 *
 * @private
 */
const generateTokenResponse = async (user: User, accessToken: string,ip : string): Promise<RefreshToken> => {
    const repo = getCustomRepository(RefreshTokenRepository);

    const oldToken = await repo.findOne({where: {user: user,ip}});

    if (oldToken) await repo.remove(oldToken);

    const token = await repo.generate(user,ip);
    token.accessToken = accessToken;
    return token;
};

export {generateTokenResponse};