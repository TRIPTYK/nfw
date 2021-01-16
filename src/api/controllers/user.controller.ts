import { Request } from "express";
import {
    Get,
    JsonApiController,
    JsonApiMethodMiddleware
} from "../../core/decorators/controller.decorator";
import { autoInjectable, singleton } from "tsyringe";
import { User } from "../models/user.model";
import BaseJsonApiController from "../../core/controllers/json-api.controller";
import DeserializeMiddleware, {
    DeserializeMiddlewareArgs
} from "../../core/middlewares/deserialize.middleware";
import { UserSerializer } from "../serializers/user.serializer";

@JsonApiController(User)
@singleton()
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
