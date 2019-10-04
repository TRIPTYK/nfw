import {documentSerialize} from "../enums/json-api/document.enum";
import {userDeserialize, userSerialize} from "../enums/json-api/user.enum";
import {BaseSerializer} from "@triptyk/nfw-core";
import {SerializerParams} from "@triptyk/nfw-core";



export class UserSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = new SerializerParams()) {
        super('user');

        const data = {
            whitelist: userSerialize,
            whitelistOnDeserialize : userDeserialize,
            relationships: {
                avatar: {
                    type: "document"
                },
                documents: {
                    type: "document"
                }
            },
        };

        this.setupLinks(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("document", {
            whitelist: documentSerialize
        });
    }
}
