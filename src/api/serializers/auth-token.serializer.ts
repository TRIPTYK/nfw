import { User } from "../models/user.model";
import { injectable } from "tsyringe";
import ISerializer from "../../core/interfaces/serializer.interface";

@injectable()
/**
 * This is a 'fake' serailizer for non json-api auth response
 */
export class AuthTokenSerializer implements ISerializer {
    public deserialize(payload) {
        return payload;
    }

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
