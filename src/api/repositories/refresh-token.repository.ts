import * as Moment from "moment-timezone";
import * as Crypto from "crypto";
import * as Boom from "boom";
import {User} from "../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";
import {DeleteResult, EntityRepository, Repository} from "typeorm";
import {jwtExpirationInterval} from "nfw-core";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {

    /** */
    constructor() {
        super();
    }
    /**
     *
     * @param user
     * @param ip
     */
    async generate(user: User,ip : string): Promise<RefreshToken> {
        const token = `${user.id}.${Crypto.randomBytes(40).toString('hex')}`;
        const expires = Moment().add(jwtExpirationInterval, 'minutes').toDate();

        const tokenObject = new RefreshToken(token, user, expires , ip);

        await this.save(tokenObject);

        return tokenObject;
    }
}
