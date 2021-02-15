import { BaseJsonApiSerializer, JsonApiSerializer } from "@triptyk/nfw-core";
import { User } from "../models/user.model";
import { UserSerializerSchema } from "./schemas/user.serializer.schema";

@JsonApiSerializer({
    type: "users",
    schemas: () => [UserSerializerSchema]
})
export class UserSerializer extends BaseJsonApiSerializer<User> {}
