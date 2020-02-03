import {documentDeserialize, documentSerialize} from "../enums/json-api/document.enum";
import {userSerialize} from "../enums/json-api/user.enum";
import { BaseSerializer, SerializerParams } from "./base.serializer";
import { injectable } from "tsyringe";

@injectable()
export class DocumentSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = {}) {
        super("document", {
            relationships: {
                user : {
                    type: "user"
                }
            },
            whitelist: documentSerialize,
            whitelistOnDeserialize : documentDeserialize
        });

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }

        this.serializer.register("user", {
            whitelist: userSerialize
        });
    }
}
