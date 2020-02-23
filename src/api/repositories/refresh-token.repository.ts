import * as Moment from "moment-timezone";
import * as Crypto from "crypto";
import {User} from "../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";
import {EntityRepository} from "typeorm";
import EnvironmentConfiguration from "../../config/environment.config";
import { BaseRepository } from "../../core/repositories/base.repository";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
    /**
     *
     * @param user
     * @param ip
     */
    public generate(user: User): Promise<RefreshToken> {
        const token = `${user.id}.${Crypto.randomBytes(40).toString("hex")}`;
        const expires = Moment().add(EnvironmentConfiguration.config.jwt.refresh_expires, "minutes").toDate();

        const tokenObject = this.create({refreshToken : token, user, expires});

        return this.save(tokenObject);
    }

    /**
     *
     * @param user
     * @param accessToken
     * @param ip
     */
    public async generateNewRefreshToken(user: User): Promise<RefreshToken>  {
        const oldToken = await this.findOne({where: {user}});

        if (oldToken) {
            await this.remove(oldToken);
        }

        const token = await this.generate(user);
        return token;
    }
}
