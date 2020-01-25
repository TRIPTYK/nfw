import { User } from "../models/user.model";

export class AuthTokenSerializer {
    public serialize(accessToken: string, refreshToken: string, user: User) {
        return {
            accessToken,
            refreshToken,
            user : {
                email : user.email,
                firstname : user.firstname,
                id : user.id,
                lastname : user.lastname,
                username : user.username
            }
        };
    }
}