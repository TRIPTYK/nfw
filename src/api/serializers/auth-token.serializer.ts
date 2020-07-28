import { User } from "../models/user.model";
import { injectable } from "tsyringe";
import SerializerInterface from "../../core/interfaces/serializer.interface";

@injectable()
/**
 * This is a 'fake' serializer for non json-api auth response
 */
export class AuthTokenSerializer {
    public deserialize(payload): any {
        return payload;
    }

    public serialize(accessToken: string, refreshToken: string, user: User): any {
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
