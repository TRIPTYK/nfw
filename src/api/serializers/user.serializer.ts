import { BaseSerializer, SerializerParams } from "./base.serializer";
import UserSchema from "./schemas/user.serializer.schema";
import {injectable, injectAll} from "tsyringe";

@injectable()
export class UserSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = {}) {
        super(UserSchema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
