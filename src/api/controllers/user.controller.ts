import { Request } from "express";
import { autoInjectable } from "tsyringe";
import BaseJsonApiController from "../../core/controllers/json-api.controller";
import {
    Get,
    JsonApiController,
    JsonApiMethodMiddleware
} from "../../core/decorators/controller.decorator";
import DeserializeMiddleware, {
    DeserializeMiddlewareArgs
} from "../../core/middlewares/deserialize.middleware";
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
