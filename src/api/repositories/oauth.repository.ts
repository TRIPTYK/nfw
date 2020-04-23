import {EntityRepository, Repository} from "typeorm";
import { OAuthToken } from "../models/oauth-token.model";

@EntityRepository(OAuthToken)
export class OAuthTokenRepository extends Repository<OAuthToken> {
    /**
     *
     * @param param
     */
    public async oAuthLogin(user, {service, accessToken, refreshToken}): Promise<OAuthToken> {
        let OAuthTokens = await this.findOne({type : service, user});

        if (OAuthTokens === undefined) {
            OAuthTokens = this.create({
                accessToken,
                refreshToken,
                type: service,
                user,
            });
        }

        return this.save(OAuthTokens);
    }
}
