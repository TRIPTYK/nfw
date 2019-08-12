import {BaseSerializer} from "./base.serializer";
import {SerializerParams} from "./serializerParams";
import {documentDeserialize, documentSerialize} from "../enums/json-api/document.enum";
import {userSerialize} from "../enums/json-api/user.enum";

export class DocumentSerializer extends BaseSerializer {
    constructor(serializerParams = new SerializerParams()) {
        super('document');

        const data = {
            whitelist: documentSerialize,
            whitelistOnDeserialize : documentDeserialize,
            relationships: {
                user : {
                    type: "user"
                }
            }
        };

        this.setupLinks(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("user", {
            whitelist: userSerialize
        });
    };

}
