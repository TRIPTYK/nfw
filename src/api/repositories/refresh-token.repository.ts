import {
    BaseJsonApiRepository,
    ConfigurationService,
    EntityRepository
} from "@triptyk/nfw-core";
import * as Crypto from "crypto";
import * as Moment from "moment-timezone";
import { autoInjectable, container } from "tsyringe";
import { RefreshToken } from "../models/refresh-token.model";
import { User } from "../models/user.model";

@EntityRepository(RefreshToken)
@autoInjectable()
export class RefreshTokenRepository extends BaseJsonApiRepository<RefreshToken> {
    /**
     *
     * @param user
     * @param ip
     */
    public generate(user: User): Promise<RefreshToken> {
        const token = `${user.id}.${Crypto.randomBytes(40).toString("hex")}`;
        const expires = Moment()
            .add(
                container.resolve<ConfigurationService>(ConfigurationService)
                    .config.jwt.refreshExpires,
                "minutes"
            )
            .toDate();

        const tokenObject = this.create({ refreshToken: token, user, expires });

        return this.save(tokenObject);
    }

    /**
     *
     * @param user
     * @param accessToken
     * @param ip
     */
    public async generateNewRefreshToken(user: User): Promise<RefreshToken> {
        const oldToken = await this.findOne({ where: { user } });

        if (oldToken) {
            await this.remove(oldToken);
        }

        const token = await this.generate(user);
        return token;
    }
}
