import { User } from "../models/user.model";
import { injectable } from "tsyringe";
import { ObjectLiteral } from "typeorm";

@injectable()
/**
 * This is a 'fake' serializer for non json-api auth response
 */
export class AuthTokenSerializer {
    public deserialize(payload: ObjectLiteral): ObjectLiteral {
        return payload;
    }

    public serialize(accessToken: string, refreshToken: string, user: User): any {
        return {
            accessToken,
            refreshToken,
            user : {
                email : user.email,
                firstname : user.first_name,
                id : user.id,
                lastname : user.last_name,
                role : user.role,
                username : user.username
            }
        };
    }
}
