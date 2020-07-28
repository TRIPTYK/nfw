import { BaseSerializer, SerializerParams } from "./base.serializer";
import UserSchema from "./schemas/user.serializer.schema";
import {injectable} from "tsyringe";
import { User } from "../models/user.model";

@injectable()
export class UserSerializer extends BaseSerializer<User> {
    public constructor(serializerParams: SerializerParams = {}) {
        super(UserSchema.schema);

        if (serializerParams.pagination) {
            this.setupPaginationLinks(serializerParams.pagination);
        }
    }
}
