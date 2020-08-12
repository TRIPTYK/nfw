import { BaseSerializer } from "./base.serializer";
import UserSchema from "./schemas/user.serializer.schema";
import {injectable} from "tsyringe";
import { User } from "../models/user.model";
import { JsonApiSerializer } from "../../core/decorators/serializer.decorator";

@injectable()
@JsonApiSerializer(User)
export class UserSerializer extends BaseSerializer<User> {
    public constructor() {
        super(UserSchema.schema);
    }
}
