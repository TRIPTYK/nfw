import { BaseJsonApiRepository } from "@triptyk/nfw-core";
import { EntityRepository } from "@triptyk/nfw-core/typeorm";
import { OAuthToken } from "../models/oauth-token.model";

@EntityRepository(OAuthToken)
export class OAuthTokenRepository extends BaseJsonApiRepository<OAuthToken> {
    /**
     *
     * @param param
     */
    public async oAuthLogin(
        user,
        { service, accessToken, refreshToken }
    ): Promise<OAuthToken> {
        let OAuthTokens = await this.findOne({ type: service, user });

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
