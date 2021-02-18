import { injectable } from "tsyringe";
import { User } from "../models/user.model";

@injectable()
/**
 * This is a 'fake' serializer for non json-api auth response
 */
export class AuthTokenSerializer {
    public deserialize(payload: Record<string, any>): Record<string, any> {
        return payload;
    }

    public serialize(
        accessToken: string,
        refreshToken: string,
        user: User
    ): any {
        return {
            accessToken,
            refreshToken,
            user: {
                email: user.email,
                firstname: user.first_name,
                id: user.id,
                lastname: user.last_name,
                role: user.role,
                username: user.username
            }
        };
    }
}
