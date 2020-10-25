import { OAuthToken } from "../models/oauth-token.model";
import BaseJsonApiRepository from "../../core/repositories/base.repository";
import { EntityRepository } from "typeorm";

@EntityRepository(OAuthToken)
export class OAuthTokenRepository extends BaseJsonApiRepository<OAuthToken> {
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
                user
            });
        }

        return this.save(OAuthTokens);
    }
}
