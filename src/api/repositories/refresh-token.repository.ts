import {
    BaseJsonApiRepository,
    ConfigurationService,
    EntityRepository
} from "@triptyk/nfw-core";
import Crypto from "crypto";
import { container } from "tsyringe";
import { RefreshToken } from "../models/refresh-token.model";
import { User } from "../models/user.model";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends BaseJsonApiRepository<RefreshToken> {
    public generate(user: User, expirationInMinutes: number): Promise<RefreshToken> {
        const token = `${user.id}.${Crypto.randomBytes(40).toString("hex")}`;
        const expires = Math.floor((new Date().getTime() / 1000) + (expirationInMinutes * 60));

        const tokenObject = this.create({ refreshToken: token, user, expires });

        return this.save(tokenObject);
    }
}
