import { BaseJsonApiSerializer } from "../../core/serializers/base.serializer";
import { singleton, autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";
import UserSerializerSchema from "./schemas/user.serializer.schema";

@singleton()
@autoInjectable()
@JsonApiSerializer({
    type : "users",
    schemas : () => [UserSerializerSchema]
})
export class UserSerializer extends BaseJsonApiSerializer<User> {
}
