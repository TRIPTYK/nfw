import { OAuthToken } from "../models/oauth-token.model";
import { JsonApiRepository } from "../../core/decorators/repository.decorator";
import { BaseRepository } from "../../core/repositories/base.repository";

@JsonApiRepository(OAuthToken)
export class OAuthTokenRepository extends BaseRepository<OAuthToken> {
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
