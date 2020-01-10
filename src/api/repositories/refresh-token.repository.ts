import * as Moment from "moment-timezone";
import * as Crypto from "crypto";
import {User} from "../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";
import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {jwtExpirationInterval} from "../../config/environment.config";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
    /**
     *
     * @param user
     * @param ip
     */
    public async generate(user: User, ip: string): Promise<RefreshToken> {
        const token = `${user.id}.${Crypto.randomBytes(40).toString("hex")}`;
        const expires = Moment().add(jwtExpirationInterval, "minutes").toDate();

        const tokenObject = this.create({refreshToken : token, user, expires , ip});

        await this.save(tokenObject);

        return tokenObject;
    }

    /**
     *
     * @param user
     * @param accessToken
     * @param ip
     */
    public async generateTokenResponse(user: User, accessToken: string, ip: string): Promise<RefreshToken>  {
        const oldToken = await this.findOne({where: {user, ip}});

        if (oldToken) {
            await this.remove(oldToken);
        }

        const token = await this.generate(user, ip);
        token.accessToken = accessToken;
        return token;
    }
}
