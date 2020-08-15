import { BaseSerializer } from "../../core/serializers/base.serializer";
import UserSchema from "./schemas/user.serializer.schema";
import {injectable} from "tsyringe";
import { User } from "../models/user.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.controller";
import UserSerializerSchema from "./schemas/user.serializer.schema2";

@injectable()
@JsonApiSerializer({
    schemas : [
        {
            name: "default",
            schema : UserSerializerSchema
        }
    ]
})
export class UserSerializer extends BaseSerializer<User> {
    public constructor() {
        super(UserSchema.schema);
    }
}
