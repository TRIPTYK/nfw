import { RefreshTokenRepository } from "./../repositories/refresh-token.repository";
import { jwtExpirationInterval, typeorm as TypeORM } from "./../../config/environment.config";
import { getCustomRepository } from "typeorm";
import { User } from "./../models/user.model";

import * as Moment from "moment-timezone";

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
const generateTokenResponse = (user : User, accessToken : string) => {
  const tokenType = 'Bearer';
  const refreshToken = getCustomRepository(RefreshTokenRepository).generate(user).token;
  const expiresIn = Moment().add(jwtExpirationInterval, 'minutes');
  return { tokenType, accessToken, refreshToken, expiresIn };
}

export { generateTokenResponse };