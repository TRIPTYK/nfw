import { RefreshToken } from "../models/refresh-token.model";

export class RefreshTokenSerializer {
    public serialize(token: RefreshToken) {
        return {
            accessToken : token.accessToken,
            refreshToken : token.refreshToken,
            user : {
                email : token.user.email,
                firstname : token.user.firstname,
                id : token.user.id,
                lastname : token.user.lastname,
                username : token.user.username
            }
        };
    }
}
