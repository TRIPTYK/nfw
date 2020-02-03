import { User } from "../models/user.model";
import { injectable } from "tsyringe";

@injectable()
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
                role : user.role,
                username : user.username
            }
        };
    }
}
