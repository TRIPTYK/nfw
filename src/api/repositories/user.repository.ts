import {User} from "../models/user.model";
import {EntityRepository, getRepository} from "typeorm";
import * as uuid from "uuid/v4";
import * as Moment from "moment-timezone";
import * as Boom from "@hapi/boom";
import {RefreshToken} from "../models/refresh-token.model";
import {Roles} from "../enums/role.enum";
import {BaseRepository} from "./base.repository";
import EnvironmentConfiguration from "../../config/environment.config";

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param options email , password and refreshObject
     *
     * @param ignoreCheck
     * @param force
     * @returns token
     */
    public async findAndGenerateToken(options: { email: string , password?: string, refreshObject?: any , ip: string },
    ignoreCheck = false , force: boolean = false ): Promise<{user : User,accessToken : string}> {
        const {password, refreshObject , ip , email} = options;

        const user = await this.findOne({email});

        if (!user) {
            throw Boom.notFound("User not found");
        }

        if (!ignoreCheck) {
            const refreshTokenRepository = getRepository(RefreshToken);
            const qb = refreshTokenRepository.createQueryBuilder("refresh")
                .where("refresh.user = :userId", {userId: user.id});

            if (EnvironmentConfiguration.config.jwt.authMode === "multiple") {
                qb.andWhere("refresh.ip = :ip", {ip});
            }

            qb.andWhere("refresh.expires > CURRENT_TIMESTAMP");

            const refreshFound = await qb.getOne();

            if (refreshFound && force === false) {
                throw Boom.forbidden("User already logged");
            }
        }

        if (password !== undefined && await user.passwordMatches(password) === false) {
            throw Boom.unauthorized("Password must match to authorize a token generating");
        }

        if (refreshObject !== undefined && refreshObject.user.email === email
            && Moment(refreshObject.expires).isBefore()) {
            throw Boom.unauthorized("Invalid refresh token.");
        }

        return {user, accessToken: user.token()};
    }

    /**
     * @param keyname
     * @param value
     */
    public async exists(keyname, value) {
        return (await this.findOne({[keyname] : value})) !== undefined;
    }

    /**
     *
     * @param param
     */
    public async oAuthLogin(user, {service, accessToken, refreshToken}) {
        user.services[service] = {
            accessToken,
            refreshToken
        };

        return this.save(user);
    }
}
