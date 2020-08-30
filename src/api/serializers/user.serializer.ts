import { BaseSerializer } from "../../core/serializers/base.serializer";
import { singleton } from "tsyringe";
import { User } from "../models/user.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";
import UserSerializerSchema from "./schemas/user.serializer.schema";

@singleton()
@JsonApiSerializer({
    type : "users",
    schemas : [UserSerializerSchema]
})
export class UserSerializer extends BaseSerializer<User> {
}
