import {documentDeserialize, documentSerialize} from "../enums/json-api/document.enum";
import {userSerialize} from "../enums/json-api/user.enum";
import { BaseSerializer , SerializerParams } from "@triptyk/nfw-core";

export class DocumentSerializer extends BaseSerializer {
    constructor(serializerParams = new SerializerParams()) {
        super("document");

        const data = {
            relationships: {
                user : {
                    type: "user"
                }
            },
            whitelist: documentSerialize,
            whitelistOnDeserialize : documentDeserialize
        };

        this.setupLinks(data, serializerParams);

        this.serializer.register(this.type, data);

        this.serializer.register("user", {
            whitelist: userSerialize
        });
    }
}
