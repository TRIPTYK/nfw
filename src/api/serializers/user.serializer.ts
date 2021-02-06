import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";
import { BaseJsonApiSerializer } from "../../core/serializers/base.serializer";
import { User } from "../models/user.model";
import UserSerializerSchema from "./schemas/user.serializer.schema";

@JsonApiSerializer({
    type: "users",
    schemas: () => [UserSerializerSchema]
})
export class UserSerializer extends BaseJsonApiSerializer<User> {}
