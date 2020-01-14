import {documentSerialize} from "../enums/json-api/document.enum";
import {userDeserialize, userSerialize} from "../enums/json-api/user.enum";
import { SerializerParams } from "@triptyk/nfw-core";
import { BaseSerializer } from "./base.serializer";

export class UserSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = new SerializerParams()) {
        super("user");

        const data = {
            relationships: {
                avatar: {
                    type: "document"
                },
                documents: {
                    type: "document"
                }
            },
            whitelist: userSerialize,
            whitelistOnDeserialize : userDeserialize
        };

        this.setupLinks(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("document", {
            whitelist: documentSerialize
        });
    }
}
