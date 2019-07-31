import {BaseSerializer} from "./base.serializer";
import {SerializerParams} from "./serializerParams";
import {UserSerializer} from "./user.serializer";


export class RefreshTokenSerializer extends BaseSerializer {

    public static whitelist: Array<string> = ['expires', 'accessToken', 'refreshToken','jwtExpirationInterval'];

    constructor(serializerParams = new SerializerParams()) {
        super('refresh-token');

        const data = {
            whitelist: RefreshTokenSerializer.whitelist,
            relationships: {
                user: {
                    type: "user"
                }
            }
        };

        this.serializer.register(this.type, data);

        this.serializer.register("user", {
            whitelist: UserSerializer.whitelist
        });
    }
}
