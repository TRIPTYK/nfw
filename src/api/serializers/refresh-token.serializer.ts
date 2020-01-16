import {userDeserialize, userSerialize} from "../enums/json-api/user.enum";
import { SerializerParams } from "@triptyk/nfw-core";
import { BaseSerializer } from "./base.serializer";

export class RefreshTokenSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = new SerializerParams()) {
        super("refresh-token");

        const data = {
            jsonapiObject : false,
            relationships: {
                user: {
                    type: "user"
                }
            },
            whitelist: userSerialize,
            whitelistOnDeserialize : userDeserialize
        };

        this.setupLinks(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("user", {
            whitelist: userSerialize
        });
    }
}
