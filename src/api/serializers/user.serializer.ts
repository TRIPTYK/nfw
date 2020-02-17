import {documentSerialize} from "../enums/json-api/document.enum";
import { BaseSerializer, SerializerParams } from "./base.serializer";
import { injectable } from "tsyringe";
import UserSchema from "./schemas/user.serializer.schema";

@injectable()
export class UserSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = {}) {
        super(UserSchema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
