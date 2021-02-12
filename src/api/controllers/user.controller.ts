import {
    BaseJsonApiController,
    DeserializeMiddleware,
    DeserializeMiddlewareArgs,
    Get,
    JsonApiController,
    JsonApiMethodMiddleware
} from "@triptyk/nfw-core";
import { Request } from "express";
import { autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import { UserSerializer } from "../serializers/user.serializer";

@JsonApiController(User)
@autoInjectable()
export default class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    @JsonApiMethodMiddleware<DeserializeMiddlewareArgs>(DeserializeMiddleware, {
        serializer: UserSerializer,
        schema: "default"
    })
    public profile(req: Request): any {
        return req.user;
    }
}
