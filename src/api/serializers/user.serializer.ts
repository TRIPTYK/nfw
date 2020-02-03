import {documentSerialize} from "../enums/json-api/document.enum";
import {userDeserialize, userSerialize} from "../enums/json-api/user.enum";
import { BaseSerializer, SerializerParams } from "./base.serializer";
import { injectable } from "tsyringe";

@injectable()
export class UserSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = {}) {
        super("user", {
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
        });

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }

        this.serializer.register("document", {
            whitelist: documentSerialize
        });
    }
}
