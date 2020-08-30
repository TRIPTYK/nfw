import {User} from "../models/user.model";
import * as Moment from "moment-timezone";
import * as Boom from "@hapi/boom";
import {RefreshToken} from "../models/refresh-token.model";
import BaseJsonApiRepository from "../../core/repositories/base.repository";

export class UserRepository extends BaseJsonApiRepository<User> {
    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param options email , password and refreshObject
     *
     * @param ignoreCheck
     * @param force
     * @returns token
     */
    public async findAndGenerateAccessToken(email: string, refreshTokenOrPassword: string | RefreshToken): Promise<{user: User; accessToken: string }> {
        const user = await this.findOne({email});

        if (!user) {
            throw Boom.notFound("User not found");
        }

        if (typeof refreshTokenOrPassword === "string") {
            if (await user.passwordMatches(refreshTokenOrPassword) === false) {
                throw Boom.unauthorized("Password must match to authorize a token generating");
            }
        }

        if (refreshTokenOrPassword instanceof RefreshToken) {
            if (refreshTokenOrPassword.user.email === email && Moment(refreshTokenOrPassword.expires).isBefore()) {
                throw Boom.unauthorized("Refresh token expired , please log-in again.");
            }
        }

        return {user, accessToken: user.generateAccessToken()};
    }

    /**
     * @param keyname
     * @param value
     */
    public async exists(keyname, value): Promise<boolean> {
        return (await this.findOne({[keyname] : value})) !== undefined;
    }
}
