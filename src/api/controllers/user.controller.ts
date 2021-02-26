import { Request } from "express";
import { autoInjectable } from "tsyringe";
import BaseJsonApiController from "../../core/controllers/json-api.controller";
import {
    Get,
    JsonApiController,
    RouteMiddleware
} from "../../core/decorators/controller.decorator";
import { Roles } from "../enums/role.enum";
import AuthMiddleware, {
    AuthMiddlewareArgs
} from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

@JsonApiController(User)
@autoInjectable()
@RouteMiddleware<AuthMiddlewareArgs>(AuthMiddleware, [Roles.Admin, Roles.User])
export default class UserController extends BaseJsonApiController<User> {
    @Get("/profile")
    public profile(req: Request): any {
        return req.user;
    }
}
