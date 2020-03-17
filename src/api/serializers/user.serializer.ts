import { BaseSerializer, SerializerParams } from "./base.serializer";
import UserSchema from "./schemas/user.serializer.schema";
import {injectable} from "tsyringe";

@injectable()
export class UserSerializer extends BaseSerializer {
    constructor(serializerParams: SerializerParams = {}) {
        super(UserSchema.schema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
