import {EntityRepository, Repository, getRepository} from "typeorm";
import { OAuthToken } from "../models/oauth-token.model";

@EntityRepository(OAuthToken)
export class OAuthTokenRepository extends Repository<OAuthToken> {
    /**
     *
     * @param param
     */
    public async oAuthLogin(user, {service, accessToken, refreshToken}) {
        let OAuthTokens = await this.findOne({type : service as any, user});

        if (OAuthTokens === undefined) {
            OAuthTokens = this.create({
                accessToken,
                refreshToken,
                user
            });
        }

        return this.save(OAuthTokens);
    }
}
