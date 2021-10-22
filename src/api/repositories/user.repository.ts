import {encode} from "jwt-simple"
import { BaseJsonApiRepository, JsonApiRepository } from "@triptyk/nfw-core";
import { User } from "../models/user.model";

@JsonApiRepository(User)
export class UserRepository extends BaseJsonApiRepository<User> {
    public generateAccessToken(user : User, expirationInMinutes: number, secret: string) {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            exp: now + (expirationInMinutes * 60),
            iat: now,
            sub: user.id
        };

        return encode(payload, secret);
    }
}
